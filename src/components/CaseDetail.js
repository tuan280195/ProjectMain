import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import GenericItems from "./until/GenericItems";
import DialogHandle from "./until/DialogHandle";
import FormButton from "./until/FormButton";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
window.Buffer = window.Buffer || require("buffer").Buffer;
const CaseDetail = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  console.log("-----case details")
  console.log(auth);
  let tokenBuffer = Buffer.from(auth.accessToken.split('.')[1], 'base64');
  let tokenParsed = JSON.parse(tokenBuffer.toString('utf-8'));
  console.log('tokenParsed', tokenParsed)

  const [template, setTemplate] = useState([
    // {
    //   keywordId: "29cfafa5-6986-4863-9997-2140a2641ab2",
    //   keywordName: "Customer Name",
    //   typeName: "List (Alphanumeric)",
    //   order: 1,
    //   roleName: "Admin",
    //   searchable: 1,
    // },
    // {
    //   keywordId: "4ba47201-0b32-4607-976c-1c60b09495d3",
    //   keywordName: "Adress",
    //   typeName: "textbox",
    //   order: 2,
    //   roleName: "Admin",
    //   searchable: 1,
    // },
    // {
    //   keywordId: "ca788522-283f-4513-865a-04ca0908b218",
    //   keywordName: "Phone No",
    //   typeName: "textbox",
    //   order: 3,
    //   roleName: "Admin",
    //   searchable: 1,
    // },
    // {
    //   keywordId: "4cf4c518-9dce-4338-a83b-c401f8cff415",
    //   keywordName: "Customer Contact Person",
    //   typeName: "textbox",
    //   order: 4,
    //   roleName: "Admin",
    //   searchable: 1,
    // },
    // {
    //   keywordId: "82222a12-4b57-49e3-b7e3-f3dfa9ca9c11",
    //   keywordName: "Reception Date",
    //   typeName: "datetime",
    //   order: 5,
    //   roleName: "Admin",
    //   searchable: 1,
    // },
  ]);
  const [data, setData] = useState([
    // {
    //   keywordId: "29cfafa5-6986-4863-9997-2140a2641ab2",
    //   value: "tiepp nguyen",
    //   keywordName: "Customer Name",
    //   TypeValue: "string",
    //   metadata: []
    // },
    // {
    //   keywordId: "4ba47201-0b32-4607-976c-1c60b09495d3",
    //   value: "bac ninh",
    //   keywordName: "Address",
    //   TypeValue: "string",
    //   metadata: []
    // },
    // {
    //   keywordId: "ca788522-283f-4513-865a-04ca0908b218",
    //   value: "0979709929",
    //   keywordName: "Phone Number",
    //   TypeValue: "string",
    //   metadata: []
    // },
    // {
    //   keywordId: "4cf4c518-9dce-4338-a83b-c401f8cff415",
    //   value: "tiep van",
    //   TypeValue: "string",
    //   keywordName: "Customer Contact Person",
    //   metadata: []
    // },
    // {
    //   keywordId: "82222a12-4b57-49e3-b7e3-f3dfa9ca9c11",
    //   value: "2023-01-28",
    //   keywordName: "Reception Date",
    //   TypeValue: "datetime",
    //   metadata: []
    // },
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const options = [
    { id: 1, label: "Tuan" },
    { id: 2, label: "Tiep" },
    { id: 3, label: "Tan" },
  ];

  useEffect(async () => {
    await getCaseTemplate();
  }, []);

  const getCaseTemplate = async (e) => {
    // call API get template
    setLoading(true);
    try {

      let templateURL = "/api/Template/template";
      const response = await axiosPrivate.get(templateURL, {
        signal: controller.signal,
      });

      console.log("template--", response.data.keywords)
      // response.data.keywords = template;
      setTemplate(response.data.keywords);
      response.data.keywords.forEach(element => {
        element.value = ""
        if(element.typeName === "List (Alphanumeric)" && element.metadata && element.metadata.length > 0){

        }
      });
      console.log("response.data.keywordstemplate--", response.data.keywords)
      setData(response.data.keywords)

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    //call API
    e.preventDefault();
    console.log("data-------", data)
    let caseCreateURL = "/api/Case";
    let payload = {
      "templateId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "keywordValues": data
    }
    console.log(axiosPrivate)
    await axiosPrivate.post(caseCreateURL, payload, {
      signal: controller.signal,
    }).then((response) => {
      console.log(response);
      return response;
    })
      .catch((error) => {
        console.log(error);
      });

  };
  const handleAttach = () => {
    setShowDialog(true);
  };

  const dynamicGenerate = (item, templateItem) => {
    return (
      <GenericItems
        value={item.value}
        value1={item.value.split("-")[0]}
        value2={item.value.split("-")[1]}
        label={templateItem.keywordName}
        type={templateItem.typeName}
        key={templateItem.order}
        handleInput={(e) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.value };
            } else return { ...value };
          });
          setData(newState);
        }}
        // using for date range
        handleInput1={(newVlue) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              const item2 = item.value.split("-")[1];
              return { ...value, value: newVlue + "-" + item2 };
            } else return { ...value };
          });
          console.log(newState);
          setData(newState);
        }}
        handleInput2={(newVlue) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              const item1 = item.value.split("-")[0];
              return { ...value, value: item1 + "-" + newVlue };
            } else return { ...value };
          });
          console.log(newState);
          setData(newState);
        }}
        handleInput3={(e) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.outerText };
            } else return { ...value };
          });
          setData(newState);
        }}
        options={item.metadata}
      ></GenericItems>
    );
  };
  const generateCode = () => {
    template.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
    const mid = (template.length + 1) / 2;
    return (
      <>
        <Grid item xs={6}>
          {template.map((templateItem) => {
            return data.map((item) => {
              if (
                item.keywordId === templateItem.keywordId &&
                templateItem.order <= mid
              ) {
                return dynamicGenerate(item, templateItem);
              } else return null;
            });
          })}
        </Grid>
        <Grid item xs={6}>
          {template.map((templateItem) => {
            return data.map((item) => {
              if (
                item.keywordId === templateItem.keywordId &&
                templateItem.order > mid
              ) {
                return dynamicGenerate(item, templateItem);
              } else return null;
            });
          })}
        </Grid>
      </>
    );
  };

  return (
    <section className="customer">
      <form>
        <Grid container columnSpacing={5} rowSpacing={3}>
          {generateCode()}
          <Grid item xs={12}>
            <div className="handle-button">
              {/* <Button
                onClick={handleAttach}
                size="medium"
                variant="contained"
                color="secondary"
                sx={{ width: "7rem" }}
              >
                Attach
              </Button> */}
              <FormButton
                itemName="Attach"
                buttonType="attach"
                onClick={handleAttach}
              />
              <FormButton itemName="Confirm" type="submit" onClick={handleSubmit} />
            </div>
          </Grid>
        </Grid>
      </form>
      <DialogHandle
        open={showDialog}
        closeDialog={() => setShowDialog(false)}
        title="Attach Files"
      ></DialogHandle>
    </section>
  );
};

export default CaseDetail;
