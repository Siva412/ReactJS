import React from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import '../../node_modules/react-datepicker/dist/react-datepicker.css';
import '../css/common.css';
import '../css/booking.css';
import $ from 'jquery';

const buttonTheme = createMuiTheme({
    palette:{
        primary:{
            main:"#ccc"
        }
    }
});
const editIconStyle = {
        height:"40px",
        width: "40px"
}
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
class BusBooking extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            formData:{},
            errorState:{},
            locationFormFlag:true,
            vehicleForm:false,
            vehicleFormEdit:true,
            contactFormFlag:false
        }
    }
    handleChange(e,field,form){
        let data = this.state.formData;
        if((field === "frmDate" || field === "toDate")){
            if(!e){
                return;
            }
            data[field] = e.toString();
            if(field === "frmDate" && data["toDate"]){
                data["toDate"] = e.toString();
            }
        }
        else{
            data[field] = e.target.value;
        }
        this.setState({formData : data});
        this.handleValidation(e, field, form);
    }
    handleValidation(e, field, form){
        let errors = this.state.errorState;
        let validFlag = true;
        if(form === 'lForm'){
            if(field === 'frmDate' || (e.target && e.target.id === "submit-btn")){
                errors.frmDate='';
                if(!e || !this.state.formData.frmDate){
                    validFlag = false;
                    errors.frmDate = 'Please select start date';
                }
            }
            if(e.target && (e.target.id ==='sl' || e.target.id === "submit-btn")){
                errors.sl='';
                if(!e.target.value && !this.state.formData.sl){
                    validFlag = false;
                    errors.sl = 'Please enter source point';
                }
            }
            if(e.target && (e.target.id === 'dest' || e.target.id === "submit-btn")){
                errors.dest='';
                if(!e.target.value && !this.state.formData.dest){
                    validFlag = false;
                    errors.dest = 'Please enter destination';
                }
            }
        }
        if(field === "edit"){
            this.setState({errorState:{}});
        }
        else{
            this.setState({errorState:errors});
        }
        return validFlag;
    }
    handleForms(form,type,flag){
        let obj = {target:{id:"submit-btn"}};
            if(type ==="submit" && this.handleValidation(obj, type, form)){
                this.setState({locationFormFlag:flag});
                this.setState({vehicleForm:true});
            }
    }
    render(){
        return (
            <div className="parent-container dashboard-cnt">
            <div className="hire-div">
            <AppBar position="static" className="dash-bar">
                <Toolbar variant="dense">
                <Typography variant="subheading" color="inherit">
                    <span className="number-dot">1</span>  Locations
                </Typography>
                </Toolbar>
            </AppBar>
            <Paper elevation={5}>
            <div className="form-div">
            {LocationForm(this.state, this.handleForms.bind(this), this.handleChange.bind(this))}
            </div>
            </Paper>
            </div>
            </div>
        )
    }
}

function LocationForm(props,hideFun,formFun){
        return (
            <div className="booking-cnt">
            <form autoComplete="off" className="reg-form mg-btm6" noValidate>
                        <div className="row">
                            <div className="col-md-3">
                            <div className="form-group">
                            <label htmlFor="frmDate">Booking date:</label>
                                <DatePicker placeholderText="Start date" dateFormat="DD/MM/YYYY" className="form-control" minDate={moment()} selected={props.formData.frmDate?moment(props.formData.frmDate):null} id="frmDate" onChange={(e) => formFun(e,"frmDate","lForm")} />
                                <small className="form-text form-err">{props.errorState.frmDate}</small>
                            </div>
                            </div>
                            <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="sl">Starting Location:</label>
                                <input type="text" className="form-control" id="sl" value={props.formData.sl} onChange={(e) => formFun(e,"sl","lForm")}/>
                                <small className="form-text form-err">{props.errorState.sl}</small>
                            </div>
                            </div>
                            <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="dest">Destination:</label>
                                <input type="text" className="form-control" id="dest" value={props.formData.dest} onChange={(e) => formFun(e,"dest","lForm")}/>
                                <small className="form-text form-err">{props.errorState.dest}</small>
                            </div>
                            </div>
                            <div className="col-md-3">
                            <Button variant="contained" className="reg-btn" color="primary" onClick={(e) => hideFun('lForm','submit',false)}>Search</Button>
                            </div>
                        </div>
                    </form>
                    <div className="reg-form">
                        <BusBlock/>
                    </div>
            </div>
        )
}
class BusBlock extends React.Component{
    constructor(props){
        super(props);
    }
    handleSelect(i){
        if($("#seat"+i).hasClass("selected")){
            $("#seat"+i).removeClass("selected");
        }
        else{
            $("#seat"+i).addClass("selected");
        }
    }
    render(){
        var busSeats = [{"id":'1'},{"id":'2'},{"id":'3'},{"id":'4'},{"id":'5'},{"id":'6'},{"id":'7'},{"id":'8'},{"id":'9'},{"id":'10'},{"id":'11'},{"id":'12'}];
        var renderSeats = busSeats.map((a,i) => {
            return (<span key={i} className="bus-seats" id={"seat"+i} onClick={() => this.handleSelect(i)}></span>)
        });
        return(
            <div className="bus-blk">
                <div className="row bus-lst">
                <span>454544</span>
                <span>454544</span>
                <span>454544</span>
                <span>454544</span>
                <span>454544</span>
                </div>
                <div className="row bus-dtls">
                    <div className="col-md-4 bus-layout">
                    <div>
                        <span className="bus-frnt"></span>
                        <span className="bus-back">
                            {/* <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span>
                            <span className="bus-seats"></span> */}
                            {renderSeats}
                        </span>
                    </div>
                    </div>
                    <div className="col-md-8">
                    </div>
                </div>
            </div>
        )
    }
}
export default BusBooking;