import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./_adminLayout.scss";
import {deleteCookie, getCookie, getJWtProperty, withParams} from "../../utils";
import {setIdAppUser,setAppUser,setModules,setClientData,setNitIdClientHashMap,
    setClientBillNameArray,setClientNitArray,setNitClientHashMap,setItemQuantityHashMap,
    setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure} from "../../redux/actions";
import moment from "moment";
import {connect} from "react-redux";
import * as constants from "../../constants";
import LoadingGif from'../../assets/gif/loading.gif';


class AdminLayout extends Component {
    constructor(props) {
        //console.log("PROPS comming in ADMINLAYOUT: ",props);
        super(props);
    }

    state = {
        collapsed: false,
        activeSubmenu: "NewsFeed",
        userData:{},
        successfulLoad:true,
        servicesToLoad: 2,
        loadedServices: 0
    };

    componentDidMount = () => {

    };


    logout = () => {
        deleteCookie("JWT");
        this.props.history.push("/login");
    };

    Loading = () => {
        return (
             <div style={{width:"100%",height:"100%",verticalAlign:"middle",textAlign:"center"}}>
                <img src={LoadingGif} alt={"Cargando..."}/>
             </div>
        );
    };


    render() {
        //console.log("LOADING: ",this.state.loadedServices);
        return (
            <Layout style={{ minHeight: "100vh"}}>
                <Layout style={{ overflow:"hidden" }}>
                    <div>THIS IS DE BODY</div>
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(connect(null,{setIdAppUser,setAppUser,setModules,setClientData,
    setNitIdClientHashMap,setClientBillNameArray,setClientNitArray,setNitClientHashMap,
    setItemQuantityHashMap,setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure})(AdminLayout));
