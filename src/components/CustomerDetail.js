import { useState, useEffect } from "react";
import axios from "../api/axios";
import LoadingSpinner from "./until/LoadingSpinner";
import FormInput from "./until/FormInput";
import { useSearchParams } from "react-router-dom";
import { Grid } from "@mui/material";
import FormButton from "./until/FormButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const CustomerDetail = () => {
  const [latestData, setLatestData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const id = searchParams.get("id");

  useEffect(async () => {
    await getCustomerDetail();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // add moree event
    try {
      if (latestData.id) {
        await axiosPrivate.put(
          "/api/Customer/" + latestData.id,
          latestData
        );
      } else {
        await axiosPrivate.post("/api/Customer", latestData);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleAddress = async (getPostCode) => {
    setLoading(true);
    const response = await axios
      .get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${getPostCode}`)
      .catch(function (error) {
        console.log(error);
      });

    if (response?.data.results != null) {
      setLatestData((value) => {
        return {
          ...value,
          stateProvince: response?.data.results[0].address1,
          city:
            response?.data.results[0].address2 +
            response?.data.results[0].address3,
        };
      });
    }
    setLoading(false);
  };

  const getCustomerDetail = async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await axiosPrivate.get(
          "https://localhost:7265/api/Customer?id=" + id
        );
        setLatestData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <section className="customer">
      <form onSubmit={handleSubmit}>
        <Grid container columnSpacing={5} rowSpacing={3}>
          <Grid item xs={6}>
            <FormInput
              label="Customer Name"
              value={latestData.name}
              type="text"
              onChange={(e) =>
                setLatestData((value) => {
                  return { ...value, name: e.target.value };
                })
              }
              className="section-input"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Phone Number"
              value={latestData.phoneNumber}
              type="text"
              className="section-input"
              required
              maxLength={11}
              onChange={(e) => {
                setLatestData((value) => {
                  return { ...value, phoneNumber: e.target.value };
                });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <div className="section-item">
              <label className="section-label">Postal Code</label>
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
                  style={{ marginRight: 10 }}
                ></input>
                -
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
                  style={{ marginLeft: 10 }}
                ></input>
              </div>
            </div>
            <div className="section-item">
              <label className="section-label">State/Province</label>
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
            <div className="section-item">
              <label className="section-label">City</label>
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
          </Grid>
          <Grid item xs={6}>
            <div className="section-item">
              <label className="section-label">Street</label>
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
            <div className="section-item">
              <label className="section-label">Building Name</label>
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
            <div className="section-item">
              <label className="section-label">Room Name</label>
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
          </Grid>
          <Grid item xs={12}>
            <div className="section-item">
              <label className="section-label">Note</label>
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
          </Grid>
          <Grid item xs={12}>
            <div className="handle-button">
              <FormButton itemName="Submit" type="submit" />
            </div>
          </Grid>
        </Grid>
      </form>
      <LoadingSpinner loading={loading}></LoadingSpinner>
    </section>
  );
};

export default CustomerDetail;
