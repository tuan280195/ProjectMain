import { useNavigate } from "react-router-dom";

const CaseManagement = () => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    navigate(link);
  };
  return (
    <section className="select-form">
      <h1>Customer Mangement</h1>
      <br></br>
      <br></br>
      <button onClick={() => handleClick("casedetail")}>Create</button>
      <button onClick={() => handleClick("casesearch")}>Search</button>
    </section>
  );
};

export default CaseManagement;
