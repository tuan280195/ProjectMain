import { useNavigate } from "react-router-dom";

const CustomerManagement = () => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    navigate(link);
  };
  return (
    <section className="select-form">
      <button onClick={() => handleClick("customerdetail")}>Create</button>
      <button onClick={() => handleClick("customersearch")}>Search</button>
    </section>
  );
};

export default CustomerManagement;
