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
            busListFlag:false,
            busLayoutNo:-1,
            busList:[],
            bookingData:''
        }
    }
    changeBusLayout(i){
        this.setState({busLayoutNo:i});
    }
    setBookingState(data){
        this.props.Submit(JSON.stringify(data));
        this.props.history.push("/bookingack");
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
        fetch('http://localhost:3000/serverData?type=booking').then(res => {
            return res.json();
        }).then(res => {
            var busList = res[0].busList;
            let obj = {target:{id:"submit-btn"}};
            if(type ==="submit" && this.handleValidation(obj, type, form)){
                this.setState({busLayoutNo:-1});
                this.setState({busListFlag:true,busList:busList});
            }
        })
    }
    render(){
        return (
            <div className="parent-container dashboard-cnt">
            <div className="hire-div">
            <AppBar position="static" className="dash-bar">
                <Toolbar variant="dense">
                <Typography variant="subheading" color="inherit">
                    Bus Booking
                </Typography>
                </Toolbar>
            </AppBar>
            <Paper elevation={5}>
            <div className="form-div">
            {LocationForm(this.state, this.handleForms.bind(this), this.handleChange.bind(this), this.changeBusLayout.bind(this),this.setBookingState.bind(this))}
            </div>
            </Paper>
            </div>
            </div>
        )
    }
}

function LocationForm(props,hideFun,formFun,showLayout,submit){
        return (
            <div className="booking-cnt">
            <form autoComplete="off" className="reg-form mg-btm6" noValidate>
                        <div className="row">
                            <div className="col-md-3">
                            <div className="form-group">
                            <label htmlFor="frmDate">Depart on:</label>
                                <DatePicker dateFormat="DD/MM/YYYY" className="form-control" minDate={moment()} selected={props.formData.frmDate?moment(props.formData.frmDate):null} id="frmDate" onChange={(e) => formFun(e,"frmDate","lForm")} />
                                <small className="form-text form-err">{props.errorState.frmDate}</small>
                            </div>
                            </div>
                            <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="sl">From:</label>
                                <input type="text" className="form-control" id="sl" value={props.formData.sl} onChange={(e) => formFun(e,"sl","lForm")}/>
                                <small className="form-text form-err">{props.errorState.sl}</small>
                            </div>
                            </div>
                            <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="dest">To:</label>
                                <input type="text" className="form-control" id="dest" value={props.formData.dest} onChange={(e) => formFun(e,"dest","lForm")}/>
                                <small className="form-text form-err">{props.errorState.dest}</small>
                            </div>
                            </div>
                            <div className="col-md-3">
                            <Button variant="contained" className="reg-btn" color="primary" onClick={(e) => hideFun('lForm','submit',false)}>Search</Button>
                            </div>
                        </div>
                    </form>
                    <div className="container reg-form">
                        <BusBlock data={props} actions={{showLayout:showLayout,submit:submit}}/>
                    </div>
            </div>
        )
}
class BusBlock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            busFormData:{},
            errorState:{},
            seatsNo: 0,
            busLayoutNo:-1
        }
    }
    handleFormChange(e){
        let formData = this.state.busFormData;
        formData[e.target.id] = e.target.value;
        this.setState({busFormData : formData});
        this.handleValidation(e);
    }
    handleValidation(e){
        let errState = this.state.errorState;
        let validFlag = true;
        if(e.target.id == "name" || e.target.id == "submitBtn"){
            errState.name='';
            if(!e.target.value && !this.state.busFormData['name']){
                errState.name = 'Please enter name';
                validFlag = false;
            }
        }
        if(e.target.id == "mobile" || e.target.id == "submitBtn"){
            errState.mobile='';
            if(!e.target.value && !this.state.busFormData['mobile']){
                errState.mobile = 'Please enter mobile no.';
                validFlag = false;
            }
            else{
                if(!(/^[0-9]{10}$/.test(this.state.busFormData.mobile))){
                    errState.mobile = 'Please enter a valid mobile no.';
                    validFlag = false;
                }
            }
        }
        if(e.target.id == "email" || e.target.id == "submitBtn"){
            errState.email='';
            if(!e.target.value && !this.state.busFormData['email']){
                errState.email = 'Please enter email';
                validFlag = false;
            }
            else{
                if(!emailRegex.test(this.state.busFormData.email)){
                    errState.email = 'Please enter a valid email';
                    validFlag = false;
                }
            }
        }
        this.setState({errorState:errState});
        return validFlag;
    }
    handleSubmit(){
        let obj = {target:{id:"submitBtn"}};
        if(this.handleValidation(obj)){
            if(this.state.seatsNo<1){
                alert("Please select atleast one seat");
                return;
            }
            let busInfo = this.props.data.busList[this.state.busLayoutNo];
            var data = {
                "name":this.state.busFormData['name'],
                "mobile":this.state.busFormData['mobile'],
                "email":this.state.busFormData['email'],
                "seviceNo":busInfo.svNo,
                "route":busInfo.route,
                "seats":this.state.seatsNo,
                "price":this.state.seatsNo*busInfo.price,
                "duration":busInfo.duration,
                "busType":busInfo.busType,
                "from":this.props.data.formData['sl'],
                "to":this.props.data.formData['dest'],
                "date":this.props.data.formData['frmDate']
            }
            this.props.actions.submit(data);
        }
    }
    handleSelect(i){
        var num = this.state.seatsNo;
        if($("#seat"+i).hasClass("wmn") || $("#seat"+i).hasClass("blk")){
            return;
        }
        if($("#seat"+i).hasClass("selected")){
            if(num > 0){
                num = num-1;
                this.setState({seatsNo:num});
            }
            $("#seat"+i).removeClass("selected");
        }
        else{
            num = num+1;
            this.setState({seatsNo:num});
            $("#seat"+i).addClass("selected");
        }
    }
    showLayout(i){
        this.setState({busLayoutNo:i,seatsNo:0});
        this.props.actions.showLayout(i);
    }
    render(){
        var busList = this.props.data.busList;
        var busListUI=[];
        busListUI = busList.map((a,i) => {
            var busSeats = a.seatList;
            var renderSeats = busSeats.map((b,i) => {
                return (<span key={i} className={'bus-seats '+b.ctgry} id={"seat"+i} onClick={() => this.handleSelect(i)}></span>)
            });
            return(
                <div className="bus-blk" key={i}>
                <div className="row bus-lst">
                <div className="col-md-2">
                <span className="sv-no text-center">{a.svNo}</span>
                <span className="text-center">{a.route}</span>
                </div>
                <div className="col-md-2 bs-tm">
                    <span>{a.time}</span>
                    <span>Duration: {a.duration}</span>
                </div>
                <div className="col-md-4 bs-tm">
                    <span>{a.busType}</span>
                    <span>via {a.via}</span>
                </div>
                <div className="col-md-2 bs-tm">
                    <span>{a.seats} seats</span>
                    <span>Window {a.window}</span></div>
                <div className="col-md-2">
                    <span>Rs.{a.price}</span>
                    <span className="layout-btn" onClick={() => this.showLayout(i)}>Show layout</span>
                </div>
                </div>
                {
                    this.props.data.busLayoutNo == i?
                <div className="row bus-dtls">
                    <div className="col-md-4 bus-layout">
                    <div>
                        <span className="bus-frnt">
                            <span className="car-steer"></span>
                        </span>
                        <span className="bus-back">
                            {renderSeats}
                        </span>
                    </div>
                    <div className="info-row">
                        <span>
                            Available <span className="iblk available"></span>
                        </span>
                        <span>
                            Selected <span className="iblk selected"></span>
                        </span>
                        <span>
                            Booked <span className="iblk blk"></span>
                        </span>
                        {/* <span>
                            Ladies <span className="iblk wmn"></span>
                        </span> */}
                    </div>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                        <div className="col-md-6">
                        <form className="bus-form" autoComplete="off">
                            <div>
                                <label>Name:</label>
                                <input id="name" type="text" onChange={(e) => {this.handleFormChange(e)}}/>
                                <span className="form-err">{this.state.errorState.name}</span>
                            </div>
                            <div>
                                <label>Mobile:</label>
                                <input id="mobile" type="text" onChange={(e) => {this.handleFormChange(e)}}/>
                                <span className="form-err">{this.state.errorState.mobile}</span>
                            </div>
                            <div>
                                <label>Email Id:</label>
                                <input id="email" type="text" onChange={(e) => {this.handleFormChange(e)}}/>
                                <span className="form-err">{this.state.errorState.email}</span>
                            </div>
                        </form>
                        </div>
                        <div className="col-md-6">
                            <div className="mg-btm6">No of Tickets: {this.state.seatsNo}</div>
                            <div className="mg-btm6">Total price: {this.state.seatsNo * a.price}</div>
                            <Button variant="contained"  color="primary" onClick={()=>{this.handleSubmit()}}>Submit</Button>
                        </div>
                    </div>
                    </div>
                </div>:null
                }
            </div>
            )
        });
        // var busSeats = busList[0].seatList;
        // var renderSeats = busSeats.map((a,i) => {
        //     return (<span key={i} className="bus-seats" id={"seat"+i} onClick={() => this.handleSelect(i)}></span>)
        // });
        
        return(
            
            <div>
            {this.props.data.busListFlag?busListUI:null}
            </div>
        )
    }
}
export default BusBooking;