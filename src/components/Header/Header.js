import React, {Component } from "react";
import {withRouter} from "react-router-dom";
import {Layout, Menu, Dropdown} from "antd";
import {getCookie, withParams, deleteCookie} from "../../utils.js";
import "antd/dist/antd.css";
import {connect} from "react-redux";
import * as constants from "../../constants";
import {getJWtProperty} from "../../utils";
import "./_Header.scss";

const {Header} = Layout;

class Sidebar extends Component {

    state = {
        collapsed: false,
        menuData: []
    };

    componentDidMount = () => {
        let headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let params = {
            idAppUser: getJWtProperty("idAppUser")
        };
        let me = this;
        var url = withParams(constants.BACKEND_URL+"/auth/AppUser", params);
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function (data) {
                /*Example data:
                "sidebar": [
                    {
                        "menuItems": [
                            "Por Cantidad",
                            "Por Almacen"
                        ],
                        "logo": "dropbox",
                        "submenuTitle": "Productos"
                    },
                    {
                        "menuItems": [
                            "Borrar"
                        ],
                        "logo": "user",
                        "submenuTitle": "Usuarios"
                    }
                ]
                */
                me.setState({menuData: data["sidebar"]});
            });
    };

    logout = () => {
        deleteCookie("JWT");
        this.props.history.push("/login");
    };

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    Perfil
                </Menu.Item>
                <Menu.Item>
                    Configuracion
                </Menu.Item>
                <Menu.Item onClick={this.logout}>
                    Salir
                </Menu.Item>
            </Menu>
        );
        return (
            <Header className={"THeader"} style={{width: "100%", paddingRight: "0px"}}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{
                        float: "right",
                        padding: "0",
                        paddingRight: "20px",
                        paddingTop: "8px",
                        verticalAlign: "center",
                        height: "100%"
                    }}
                >
                    <Dropdown overlay={menu}>
                        <div className="ant-dropdown-link">
                            {this.props.firstName}
                        </div>
                    </Dropdown>
                </Menu>
            </Header>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    //console.log("REDUCER OF APP: ",appUserReducer);
    const { firstName, idAppUser } = appUserReducer;
    return {firstName, idAppUser};
};

export default withRouter(connect(mapStateToProps)(Sidebar));
