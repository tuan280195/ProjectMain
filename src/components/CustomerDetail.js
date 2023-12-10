import { useState } from "react";
import axios from "../api/axios";
import LoadingSpinner from "./until/LoadingSpinner";

const CustomerDetail = () => {
  const [latestData, setLatestData] = useState({
    customerNumber: "auto filled",
    customerName: "Toyota",
    phoneNumber: "081917199",
    postCode1: "100",
    postCode2: "0005",
    stateProvince: "Tokyo",
    city: "Tokyo",
    street: "Test",
    buildingName: "Granda",
    roomNumber: "502",
    note: "No Note",
  });

  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    console.log(latestData);
    console.log(latestData["postalCode1"]);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleAddress = async (getPostCode) => {
    setLoading(true);
    const response = await axios.get(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${getPostCode}`
    );

    console.log(JSON.stringify(response?.data));
    setLatestData((value) => {
      return {
        ...value,
        stateProvince: response?.data.results[0].address1,
        city: response?.data.results[0].address2,
      };
    });
    setLoading(false);
  };

  return (
    <section className="customer" onSubmit={handleSubmit}>
      <h1>Customer</h1>
      <br></br>
      <form>
        <div className="item-section">
          <label>Customer Number: </label>
          <input
            value={latestData.customerNumber}
            disabled
            className="section-input"
          ></input>
        </div>
        <div className="item-section">
          <label>Customer Name: </label>
          <input
            value={latestData.customerName}
            onChange={(e) =>
              setLatestData((value) => {
                e.target.setCustomValidity("");
                return { ...value, customerName: e.target.value };
              })
            }
            className="section-input"
            required
            onInvalid={(e) => {
              e.target.setCustomValidity(
                "error msg: Please enter Customer Name"
              );
            }}
          ></input>
        </div>
        <div className="item-section">
          <label className="label-section">Phone No</label>
          <input
            value={latestData.phoneNumber}
            type="text"
            onChange={(e) => {
              setLatestData((value) => {
                return { ...value, phoneNumber: e.target.value };
              });
              e.target.setCustomValidity("");
            }}
            className="section-input"
            required
            onInvalid={(e) => {
              e.target.setCustomValidity("error msg: Please enter Phone No");
            }}
            maxLength={11}
          ></input>
        </div>
        <div className="item-section">
          <label className="label-section">Postal Code</label>
          <div className="section-range">
            <input
              type="text"
              pattern="[0-9]*"
              className="section-input"
              name="range1"
              value={latestData.postCode1}
              onChange={(e) => {
                setLatestData((value) => {
                  return { ...value, postCode1: e.target.value };
                });

                if (e.target.value.length === 3) {
                  const nextSibling =
                    document.querySelector(`input[name='range2']`);
                  if (nextSibling != null) {
                    setLatestData((pos) => {
                      return { ...pos, postCode2: "" };
                    });
                    nextSibling.focus();
                  }
                }
              }}
              maxLength={3}
            ></input>{" "}
            -{" "}
            <input
              type="text"
              className="section-input"
              name="range2"
              value={latestData.postCode2}
              onChange={(e) => {
                setLatestData((value) => {
                  return { ...value, postCode2: e.target.value };
                });
                if (e.target.value.length === 4) {
                  handleAddress(latestData.postCode1 + e.target.value);
                }
              }}
              pattern="[0-9]*"
              maxLength={4}
            ></input>
          </div>
        </div>
        <div className="item-section">
          <label className="label-section">State/Province</label>
          <input
            type="text"
            className="section-input"
            value={latestData.stateProvince}
            onChange={(e) =>
              setLatestData((value) => {
                return { ...value, stateProvince: e.target.value };
              })
            }
          ></input>
        </div>
        <div className="item-section">
          <label className="label-section">City</label>
          <input
            value={latestData.city}
            type="text"
            onChange={(e) =>
              setLatestData((value) => {
                return { ...value, city: e.target.value };
              })
            }
            className="section-input"
          ></input>
        </div>
        <div className="item-section">
          <label className="label-section">Street</label>
          <input
            value={latestData.street}
            type="text"
            onChange={(e) =>
              setLatestData((value) => {
                return { ...value, street: e.target.value };
              })
            }
            className="section-input"
          ></input>
        </div>
        <div className="item-section">
          <label className="label-section">Building Name</label>
          <input
            value={latestData.buildingName}
            type="text"
            onChange={(e) =>
              setLatestData((value) => {
                return { ...value, buildingName: e.target.value };
              })
            }
            className="section-input"
          ></input>
        </div>
        <div className="item-section">
          <label className="label-section">Room Name</label>
          <input
            value={latestData.roomNumber}
            type="text"
            onChange={(e) =>
              setLatestData((value) => {
                return { ...value, roomNumber: e.target.value };
              })
            }
            className="section-input"
          ></input>
        </div>
        <div className="item-section">
          <label className="label-section">Note</label>
          <textarea
            value={latestData.note}
            onChange={(e) =>
              setLatestData((value) => {
                return { ...value, note: e.target.value };
              })
            }
            className="section-input"
          ></textarea>
        </div>
        <button onClick={handleClick}>Submit</button>
      </form>
      <LoadingSpinner loading={loading}></LoadingSpinner>
    </section>
  );
};

export default CustomerDetail;
