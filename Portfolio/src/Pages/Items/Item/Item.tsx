import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import { usePortfolioItem } from "../../../Hooks/UsePortfolio";
import { useParams, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ViewCard from "../../../Components/Cards/Items/ItemDetailCards/View/ViewItemDetailCard"
import CreateCard from "../../../Components/Cards/Items/ItemDetailCards/Create/CreateItemDetailCard"
import AlertSnackbar from "../../../Components/Snackbar/AlertSnackbar"
import Navbar from '../../../Components/Navbar/Navbar'
import IconButton from "@mui/material/IconButton";
import HomeIcon from '@mui/icons-material/Home';
import "../../../Colours.css";
import styles from './Item.module.css';

const ItemPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { mutate, data: item, error, isPending: isLoading } = usePortfolioItem();
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if ((mode === "view" || mode === "update") && id) {
      mutate(Number(id));
    }
  }, [id, mode, mutate]);

  const itemDetail = item ?? null;

  if (isLoading)
      return (
        <div className={styles['container']}>
          <div className={styles['data-loading']}>
            <CircularProgress aria-label="Loading…" />
          </div> 
        </div>
      );
      
      if (error)
        return (
          <div className={styles['container']}>
            <div className={styles['data-loading']}>
              Failed to load the portfolio item.
            </div>
          </div>
        );

  if (!isAdmin && (mode === "create" || mode === "update")){
    return (
      <div className={styles['container']}>
        <div className={styles['data-loading']}>
          <div>
            You are not authorised to view this page.
            Click the icon to go home.
          </div>
          <IconButton
            aria-label="home"
            size="large"
            onClick={() => navigate("/")}
          >
            <HomeIcon className={styles['home-icon']} />
          </IconButton>
        </div>
      </div>
    )
  }
  
  return (
    <div className={styles['container']}>
      {mode === "view" && (
        <div>
          {itemDetail !== null ? (
            <ViewCard item={itemDetail}/>
          ) : (
            <div className={styles['data-loading']}>
              Couldn't find an item for id: {id ?? 0}
            </div>
          )}
        </div>
      )}

      {mode === "create" && isAdmin && (
        <CreateCard isUpdate={false} />
      )}

      {mode === "update" && isAdmin && (
        <div>
          {itemDetail !== null ? (
            <CreateCard isUpdate={true} item={itemDetail} onUpdateSuccess={() => setOpenAlert(true)} />
          ) : (
            <div className={styles['data-loading']}>
              Couldn't find an item for id: {id ?? 0}
            </div>
          )}
        </div>
      )}

      <Navbar />

      <AlertSnackbar
        open={openAlert}
        setOpen={setOpenAlert}
        severity="success"
        message="Item updated successfully"
      />
    </div>
  );
};

export default ItemPage;