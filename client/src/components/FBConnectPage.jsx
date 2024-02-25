import React, { useEffect, useState } from "react";
import Card from "./CommonComponents/Card";
import Button from "./CommonComponents/Button";
import { useAuth } from "../hooks/auth";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GraphApi } from "../Api/Axios";
import { showError, showSuccess } from "../lib/utils";
import axios from 'axios';
import { Link } from "react-router-dom";
const FBConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [integratedPageName, setIntegratedPageName] = useState(false);
  const auth = useAuth();

  const facebookAppID = 735852345279671;
  // const facebookRedirectURI = import.meta.VITE_PUBLIC_URL_ENCODED;

  const getPageId = async (accessToken) => {
    setLoading(true);
    try {
      const res = await GraphApi.get("/me/accounts", {
        params: { access_token: accessToken },
      });
      console.log(res);
      const pageObj = {
        name: res?.data?.data[0]?.name,
        id: res?.data?.data[0]?.id,
        pageAccessToken: res?.data?.data[0]?.access_token,
      };


      localStorage.setItem("FB_PAGE_ID", pageObj?.id);
      localStorage.setItem("FB_PAGE_ACCESS_TOKEN", pageObj.pageAccessToken);
      localStorage.setItem("FB_PAGE_DETAILS", JSON.stringify(pageObj));
      showSuccess(`Connected to Facebook page ${pageObj?.name}`);

      // send the pageObj to the backend so that Backend can work smoothly.
      axios.post('https://internassigment.onrender.com/api/sendData', pageObj)
        .then(response => {
          console.log('Response from the backend:', response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      const storedPageDetails = localStorage.getItem("FB_PAGE_DETAILS");
      setIntegratedPageName(() => {
        return (storedPageDetails ? JSON.parse(storedPageDetails).name : null);
      })
      setIsConnected(true);
    } catch (error) {
      setLoading(false);
      showError("Could not connect to the Facebook page");
      localStorage.removeItem("FB_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ID");
    }
    setLoading(false);
  };

  const responseFacebook = async (data) => {
    setLoading(true);
    try {
      if (data.accessToken) {
        const accessToken = data.accessToken;
        localStorage.setItem("FB_ACCESS_TOKEN", accessToken);
        console.log(accessToken);
        await getPageId(accessToken);
      }
    } catch (error) {
      setLoading(false);
      showError("Could not connect to the Facebook page");
      localStorage.removeItem("FB_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ID");
    }
    setLoading(false);
  };

  const deleteConnection = () => {
    setLoading(true);
    localStorage.removeItem("FB_PAGE_DETAILS");
    localStorage.removeItem("FB_ACCESS_TOKEN");
    localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
    localStorage.removeItem("FB_PAGE_ID");
    setIsConnected(false);
    setLoading(false);
  };

  const checkPageConnected = () => {
    const accessToken = localStorage.getItem("FB_ACCESS_TOKEN");
    const storedPageDetails = localStorage.getItem("FB_PAGE_DETAILS");
    setIntegratedPageName(() => {
      return (storedPageDetails ? JSON.parse(storedPageDetails).name : null);
    });

    if (!accessToken) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkPageConnected();
  }, []);

  return (
    <div className="h-[100vh] w-[100vw] bg-primary  flex justify-center items-center">
      <Card>
        <div className={`flex flex-col items-center justify-center w-[300px] ${isConnected ? 'gap-0' : 'gap-6'}`}>
          <h1 className="font-semibold text-lg">Facebook Page Integration</h1>
          {isConnected ? (
            <>
              <p className="mb-5 mt-0 ">Integrated Page:<span className="font-semibold">
                {integratedPageName}  </span></p>

              <div className="w-full flex flex-col gap-3">
                <Button
                  className={"border-transparent	"}
                  onClick={deleteConnection}
                  variant="DANGER"
                  loading={loading}
                >
                  Delete Integration
                </Button>
                <Link className="w-full" to="/helpdesk">
                  <Button className="w-full border-transparent">Reply To Messages</Button>
                </Link>
              </div>
            </>
          ) : (
            // <Button className="w-full">Connect Page</Button>
            <FacebookLogin
              appId={facebookAppID}
              redirectUri={"https://www.facebook.com/connect/login_success.html"}
              scope="pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata"
              callback={responseFacebook}
              onFailure={() => {
                showError("Could not connect to the Facebook page");
              }}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  loading={loading}
                  className="w-full"
                >
                  Connect Page
                </Button>
              )}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default FBConnectPage;
