import axios, { AxiosError } from "axios";
import cors from "cors";
import crypto from "crypto";
import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import https from "https";
import multer from "multer";
import path from "path";
import session from "express-session";
import "dotenv/config";
import "./Types/env";
import "./Types/Session";

import type { AuthenticationModel, AuthoriseModel, LoginModel } from "./Types/Authentication";
import type { UserModel } from "./Types/User";
import type { FilterModel, FilterRequestModel } from "./Types/Filter";
import type { MetricRequestModel } from "./Types/Metric";
import type { ItemModel, ItemRequestModel } from "./Types/Item";
import type { MediaModel, MediaRequestModel, MediaUpdateRequestModel } from "./Types/Media";
import type { SuccessResponseModel } from "./Types/API Response";

if (process.env.NODE_ENV !== "production") {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  axios.defaults.httpsAgent = httpsAgent;
}

const app = express();
app.use(express.json());


// ---- CORS ----
// Allows the Portfolio to send requests to the proxy
// credentials: true is required for the session cookie to be sent
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));

// ---- Sessions ----
// Create a session for each visitor and give the browser a cookie.
// httpOnly: true stops JavaScript from reading the cookie.
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000
  }
}));

// ---- Static Files ----
// Serves uploaded media files from the configured directory.
const MEDIA_PATH = process.env.MEDIA_PATH;
const MEDIA_DOMAIN = process.env.MEDIA_DOMAIN;

app.use("/uploads", express.static(MEDIA_PATH));

// ---- File Upload ----
// Multer stores uploaded files in memory until we write them to the configured path.
const upload = multer({ storage: multer.memoryStorage() });

// ---- Service Account Token ----
// Token shared across all visitors.
// Authenticates the proxy fo visitors can read the portfolio data.
const API_URL = process.env.API_URL;
const API_USERNAME = process.env.API_USERNAME;
const API_PASSWORD = process.env.API_PASSWORD;
const API_PHRASE = process.env.API_PHRASE;

let serviceToken: string | null = null;
let serviceTokenExpiresAt: number = 0;

async function getServiceToken(): Promise<string> {
  if (serviceToken && Date.now() < serviceTokenExpiresAt) {
    return serviceToken;
  }

  const basicAuth = Buffer.from(
    `${API_USERNAME}:${API_PASSWORD}`
  ).toString("base64");

  const body: AuthoriseModel = {
    phrase: API_PHRASE
  };

  const { data } = await axios.post<AuthenticationModel>(
    `${API_URL}/auth/token`,
    body,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json"
      }
    }
  );

  serviceToken = data.token;
  serviceTokenExpiresAt = Date.now() + (data.expiresIn - 60) * 1000;

  return serviceToken;
}

// ---- Helpers ----
// Extracts a consistent error from Axios to prevent repeats of catch logic.
function errorResponse(error: unknown): { status: number; message: unknown } {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    return {
      status: axiosError.response?.status || 500,
      message: axiosError.response?.data || "Proxy error"
    };
  }

  return {
    status: 500,
    message: "Unexpected error:"
  };
}

// ---- Auth Routes ----
// Checks if the user details exist in the api.
app.post("/auth/login", async (req: Request<{}, {}, LoginModel>, res: Response) => {
  const { username, password } = req.body;

  try {
    const token = await getServiceToken();

    const { data: users } = await axios.get<UserModel[]>(
      `${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        Username: username
      }
    });

    if (!users || users.length === 0) {
      return res.status(401)
        .json({
          message: "Invalid credentials"
        });
    }

    const user: UserModel = users[0];

    if (user.isDeleted) {
      return res.status(204)
        .json({
          message: "No user found with the details provided"
        });
    }

    if (password !== user.password) {
      return res.status(401)
        .json({
          message: "Invalid credentials"
        });
    }

    if (!user.scopes.includes("Portfolio API")){
      return res.status(401)
        .json({
          message: "User doesn't have the Portfolio API scope"
        });
    }

    req.session.authenticated = true;
    req.session.username = user.username;

    res.json({
      message: "Logged in"
    });
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({
      message: "Logged out"
    });
  });
});

app.get("/auth/status", (req: Request, res: Response) => {
  res.json({
    authenticated: !!req.session.authenticated
  });
});

// ---- Middleware ----
// Runs before the API call to check whether a user has logged in.
// If they have, the next function runs.
// Otherwise, it stops the call running.
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.authenticated) {
    res.status(401)
      .json({
        message: "Not authenticated"
      });

      return;
  }

  next();
}

// ---- Read Routes ----
// Proxy authenticates with the API using the service account token.
// -- Filter --
app.get("/filter", async (req: Request, res: Response) => {
  try {
    const token = await getServiceToken();
    
    const { data } = await axios.get<FilterModel[]>(
      `${API_URL}/portfolio/filter`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: req.query
    });

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

// -- Item --
app.get("/item", async (req: Request, res: Response) => {
  try {
    const token = await getServiceToken();
    
    const { data } = await axios.get<ItemModel[]>(
      `${API_URL}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: req.query
    });

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.get("/item/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const token = await getServiceToken();
    
    const { data } = await axios.get<ItemModel>(
      `${API_URL}/portfolio/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

// -- Media --
app.get("/media/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const token = await getServiceToken();
    
    const { data } = await axios.get<MediaModel[]>(
      `${API_URL}/media/Portfolio/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

// ---- Write Routes ----
app.post("/metric", async (req: Request<{}, {}, MetricRequestModel>, res: Response) => {
  try {
    const token = await getServiceToken();

    const { data } = await axios.post<SuccessResponseModel>(
      `${API_URL}/portfolio/metric`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

// ---- Protected Write Routes ----
// Proxy confirms the user is logged in before continuing the call using it's service credentials.
// -- Filter --
app.post("/filter", requireAuth, async (req: Request<{}, {}, FilterRequestModel>, res: Response) => {
  try {
    const token = await getServiceToken();

    const { data } = await axios.post<FilterModel>(
      `${API_URL}/portfolio/filter`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.patch("/filter/:id", requireAuth, async (req: Request<{ id: string }, {}, FilterRequestModel>, res: Response) => {
  try {
    const token = await getServiceToken();

    const { data } = await axios.patch<FilterModel>(
      `${API_URL}/portfolio/filter/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.delete("/filter/:id", requireAuth, async (req: Request<{ id: string }, {}, SuccessResponseModel>, res: Response) => {
  try {
    const token = await getServiceToken();
    
    const { data } = await axios.delete<SuccessResponseModel>(
      `${API_URL}/portfolio/filter/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

// -- Item --

app.post("/item", requireAuth, async (req: Request<{}, {}, ItemRequestModel>, res: Response) => {
  try {
    const token = await getServiceToken();

    const { data } = await axios.post<ItemModel>(
      `${API_URL}/portfolio`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.patch("/item/:id", requireAuth, async (req: Request<{ id: string }, {}, ItemRequestModel>, res: Response) => {
  try {
    const token = await getServiceToken();

    const { data } = await axios.patch<ItemModel>(
      `${API_URL}/portfolio/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.delete("/item/:id", requireAuth, async (req: Request<{ id: string }, {}, SuccessResponseModel>, res: Response) => {
  try {
    const token = await getServiceToken();
    
    const { data } = await axios.delete<SuccessResponseModel>(
      `${API_URL}/portfolio/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

// -- Media --

app.post("/media/upload/:id", requireAuth, upload.single("file"), async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    if (!fs.existsSync(MEDIA_PATH)) {
      fs.mkdirSync(MEDIA_PATH, { recursive: true });
    }

    const file = req.file;
    const extension = path.extname(file.originalname);
    const name = path.basename(file.originalname, extension);
    const filePath = path.join(MEDIA_PATH, file.originalname);

    fs.writeFileSync(filePath, file.buffer);

    const token = await getServiceToken();

    const mediaRequest: MediaRequestModel = {
      name: name,
      extension: extension,
      mimeType: file.mimetype,
      size: file.size,
      path: null,
      domain: MEDIA_DOMAIN
    };

    const { data } = await axios.post<MediaModel>(
      `${API_URL}/media/Portfolio/${req.params.id}`,
      mediaRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(201).json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.post("/media/:id", requireAuth, async (req: Request<{ id: string }, {}, MediaRequestModel>, res: Response) => {
  try {
    const token = await getServiceToken();

    const { data } = await axios.post<MediaModel>(
      `${API_URL}/media/Portfolio/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.patch("/media/:id", requireAuth, async (req: Request<{ id: string }, {}, MediaUpdateRequestModel>, res: Response) => {
  try {
    const token = await getServiceToken();

    const { data } = await axios.patch<MediaModel>(
      `${API_URL}/media/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

app.delete("/media/:id", requireAuth, async (req: Request<{ id: string }, {}, { fileName?: string }>, res: Response) => {
  try {
    const token = await getServiceToken();

    if (req.body.fileName) {
      const filePath = path.join(MEDIA_PATH, req.body.fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const { data } = await axios.delete<SuccessResponseModel>(
      `${API_URL}/media/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(data);
  }

  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status || 500,
        data: error.response?.data || "Proxy error",
        url: error.config?.url
      });
    }

    else {
      console.error("Unexpected error:", error);
    }

    const { status, message } = errorResponse(error);

    res.status(status)
      .json({
        message
      });
  }
});

// ---- Start ----
app.listen(process.env.PORT, () => {
  console.log(`Proxy running on port ${process.env.PORT}`);
});