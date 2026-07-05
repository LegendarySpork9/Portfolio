import { useParams } from "react-router-dom";

const ItemPage = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Item Detail Page</h1>
      <p>Item ID: {id}</p>
    </div>
  );
};

export default ItemPage;