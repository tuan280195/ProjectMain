import { useNavigate } from "react-router-dom";

const CustomerManagement = () => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    navigate(link);
  };
  return (
    <section className="select-form">
      <h1>Customer Mangement</h1>
      <br></br>
      <br></br>
      <button onClick={() => handleClick("customerdetail")}>Create</button>
      <button onClick={() => handleClick("customersearch")}>Search</button>
    </section>
  );
};

export default CustomerManagement;
