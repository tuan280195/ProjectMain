import { useNavigate } from "react-router-dom";

const buttonItems = ["Create", "Search"];

const CustomerManagement = () => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    navigate(link);
  };
  return (
    <section>
      <h1>Customer Mangement</h1>
      <br></br>
      <br></br>
      <button onClick={() => handleClick("customerdetail")}>Create</button>
      <button onClick={() => handleClick("customersearch")}>Search</button>
    </section>
  );
};

export default CustomerManagement;
