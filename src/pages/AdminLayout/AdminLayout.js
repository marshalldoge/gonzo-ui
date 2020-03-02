import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {deleteCookie, getCookie, getJWtProperty, withParams} from "../../utils";
import {setIdAppUser,setAppUser,setModules,setClientData,setNitIdClientHashMap,
    setClientBillNameArray,setClientNitArray,setNitClientHashMap,setItemQuantityHashMap,
    setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure} from "../../redux/actions";
import moment from "moment";
import {connect} from "react-redux";
import * as constants from "../../constants";
import LoadingGif from'../../assets/gif/loading.gif';

const Header = React.lazy(() => import("../../components/Header/Header"));
const Body = React.lazy(() => import("../../components/Body/Body"));

class AdminLayout extends Component {
    constructor(props) {
        //console.log("PROPS comming in ADMINLAYOUT: ",props);
        super(props);
        this.handleActiveSubmenu = this.handleActiveSubmenu.bind(this)
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
        this.props.setIdAppUser(getJWtProperty("idAppUser"));
        this.loadAppUser();
        this.loadModules();
    };


    loadAppUser(){
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: getJWtProperty("idAppUser")
        };
        var url = withParams(constants.BACKEND_URL+"/auth/AppUser", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setAppUser(data);
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V7");
                    return prevState;
                });
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    }
    loadModules(){
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: getJWtProperty("idAppUser"),
            loc:false
        };
        var url = withParams(constants.BACKEND_URL+"/auth/AppUserModuleAction/reducer", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setModules(data);
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V6");
                    return prevState;
                });
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    }


    handleActiveSubmenu=(newActiveSubmenu)=>{
        this.setState({activeSubmenu:newActiveSubmenu});
        console.log("GOING TO SUBMENU; ",newActiveSubmenu.replace( /\s/g, ''));
        this.props.history.push(newActiveSubmenu.replace( /\s/g, '') );
    };

    onCollapse = collapsed => {
        //console.log(collapsed);
        this.setState({ collapsed });
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

    Body = () => {
        return (
             <Body
                  style={{height: "100%"}}
                  activeSubmenu={this.state.activeSubmenu}
             />
        );
    };

    render() {
        //console.log("LOADING: ",this.state.loadedServices);
        return (
            <Layout style={{ minHeight: "100vh"}}>
                <Layout style={{ overflow:"hidden" }}>
                    <Header style={{height: "100%"}}/>
                    {
                        this.state.loadedServices === this.state.servicesToLoad?
                        this.Body():this.Loading()
                    }
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(connect(null,{setIdAppUser,setAppUser,setModules,setClientData,
    setNitIdClientHashMap,setClientBillNameArray,setClientNitArray,setNitClientHashMap,
    setItemQuantityHashMap,setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure})(AdminLayout));
