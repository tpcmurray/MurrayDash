import React, { Component } from 'react';

export class MurrayDash extends Component {
    static displayName = MurrayDash.name;
    colorDarkTerry = "rgb(117, 117, 117)";
    colorDarkNicole = "rgb(0, 132, 29)";
    colorDarkFamily = "rgb(203, 113, 0)";
    colorDarkAddison = "rgb(0, 59, 246)";
    colorDarkSkylar = "rgb(185, 19, 70)";


    constructor(props) {
        super(props);
        this.state = { choreCalcs: [], calendarEvents: [], loading: true };
    }

    componentDidMount() {
        this.fetchInitialState();
        this.interval = setInterval(() => this.tick1Sec(), 1000);
        this.interval = setInterval(() => this.tick10Min(), 600000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick1Sec() {
        this.calendar();
    }

    tick10Min() {
        this.setChoreCalcsState();
        this.setCalendarEventState();
    }

    async fetchInitialState() {
        const responseChoreCalcs = await fetch('murraydash/GetChoreCalcs');
        const dataChoreCalcs = await responseChoreCalcs.json();
        this.setState({ choreCalcs: dataChoreCalcs });

        const responseEvents = await fetch('murraydash/GetEvents');
        const dataEvents = await responseEvents.json();
        this.setState({ calendarEvents: dataEvents, loading: false });
    }

    async setChoreCalcsState() {
        const response = await fetch('murraydash/GetChoreCalcs');
        const data = await response.json();
        this.setState({ choreCalcs: data, loading: false });
    }

    async setCalendarEventState() {
        const response = await fetch('murraydash/GetEvents');
        const data = await response.json();
        this.setState({ calendarEvents: data, loading: false });
    }

    calendar() {

        let calDrawer = new CalDraw();
        calDrawer.drawRects();
        calDrawer.drawTimes();

        // events
        if (!this.state.loading) {
            var events = this.state.calendarEvents;
            var x = 0;
            var color = "";
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                switch (String(event.calendarId)) {
                    case "nicolelanamurray@gmail.com":
                        x = 412;
                        color = this.colorDarkNicole;
                        break;
                    case "addisonnicolemurray@gmail.com":
                        x = 1152;
                        color = this.colorDarkAddison;
                        break;
                    case "skylarterimurray@gmail.com":
                        x = 1522;
                        color = this.colorDarkSkylar;
                        break;
                    default:
                        if (event.description &&  event.description.includes("Family")) {
                            x = 782;
                            color = this.colorDarkFamily;
                        } else {
                            x = 42;
                            color = this.colorDarkTerry;
                        }
                }

                var dStart = new Date(event.start);
                var dEnd = new Date(event.end);

                calDrawer.drawEvent(x, color, dStart, dEnd, event.summary);
            }
        }

        calDrawer.drawHeader();
        calDrawer.drawNowLine();
    }

    render() {
        let choreCalcs = this.state.loading
            ? <p><em>Loading...</em></p>
            : MurrayDash.renderChoreCalcs(this.state.choreCalcs);

        return (
            <div className="all">
                <div className="top-container">
                    <div className="top-left-container round-box">
                        <div id="clockyTime" className="time-title grey">Time</div> 
                        <div id="clockyDate" className="box-title grey">Date</div>
                        <div><img alt="weather" src="weather-sunny-with-raining-periods.png" /></div>
                    </div>
                    <div className="top-center-container round-box">
                        <div className="box-title grey">Meal Schedule</div>
                    </div>
                    <div className="top-right-container round-box">
                        <div className="box-title FamilyOrange">Chore Points</div>
                        <div className="choreRoot">
                            <canvas id="chore-progress-canvas" width="50" height="369" style={{ background: "#333333" }}></canvas>
                            {choreCalcs}
                        </div>
                    </div>
                </div>
                <canvas id="cal-container" width="1920" height="550" style={{ background: "#333333" }}></canvas>

            </div>
        );
    }

    static renderChoreCalcs(choreCalcs) {

        var c = document.getElementById("chore-progress-canvas");
        var ctx = c.getContext("2d");
        var barHeight = 363;
        var barWidth = 44;
        var progressBarHeight = barHeight * (choreCalcs.percentComplete / 100);
        var totalPoints = choreCalcs.skylarTotal + choreCalcs.addisonTotal;

        // purple bar
        ctx.beginPath();
        ctx.fillStyle = "rgb(167, 52, 255)";
        ctx.fillRect(3, barHeight - progressBarHeight + 3, barWidth, progressBarHeight);

        // text
        ctx.beginPath();
        ctx.font = "Bold 13px Helvetica";
        ctx.fillStyle = "rgb(160, 160, 160)";
        ctx.fillText("11,000", 5, 15);

        var pointsTextWidth = ctx.measureText(choreCalcs.totalPoints).width;
        ctx.fillText(choreCalcs.totalPoints, ((barWidth + 6) - pointsTextWidth) / 2, barHeight - progressBarHeight);

        ctx.font = "12px Helvetica";
        ctx.fillStyle = "rgb(51, 51, 51)";
        var percText = "(" + choreCalcs.percentComplete + "%)";
        var percTextWidth = ctx.measureText(percText).width;
        ctx.fillText(percText, ((barWidth + 6) - percTextWidth) / 2, barHeight - progressBarHeight + 15);



        return (
            <table className="choreCalcs">
                <tbody>
                    <tr><td className="rightalign">Daily Average Total:</td><td>{choreCalcs.dailyAverage}</td></tr>
                    <tr><td className="rightalign">Daily Average Last 7 Days:</td><td>{choreCalcs.averageLast7Days}</td></tr>
                    <tr><td className="rightalign">Daily Average Needed:</td><td>{choreCalcs.dailyAvgNeeded}</td></tr>
                    <tr><td className="rightalign">Days Left At Current Rate:</td><td>{choreCalcs.daysAtCurrentRate}</td></tr>
                    <tr><td>&nbsp;</td><td></td></tr>
                    <tr><td className="rightalign">Date To Reach 11,000:</td><td>{choreCalcs.dateTo11k.substring(0, 10)}</td></tr>
                    <tr><td className="rightalign">Are You Winning!?:</td><td>{choreCalcs.isWinning ? 'Yes!' : 'No :('}</td></tr>
                    <tr><td>&nbsp;</td><td></td></tr>
                    <tr><td className="rightalign">Addison Total:</td><td>{choreCalcs.addisonTotal}</td></tr>
                    <tr><td className="rightalign">Skylar Total:</td><td>{choreCalcs.skylarTotal}</td></tr>
                    <tr><td className="rightalign">Total:</td><td>{choreCalcs.skylarTotal + choreCalcs.addisonTotal}</td></tr>
                </tbody>
            </table>
        );
    }
}

class CalDraw {

    c = document.getElementById("cal-container");
    ctx = this.c.getContext("2d");

    nowLine = 42;
    pixelsPerMin = 0.70;
    workableCalHeight = 472;
    hoursVisible = this.workableCalHeight / (this.pixelsPerMin * 60) - 1;

    // colors
    colorTerry = "rgb(117, 117, 117)";
    colorNicole = "rgb(0, 132, 29)";
    colorFamily = "rgb(203, 113, 0)";
    colorAddison = "rgb(0, 59, 246)";
    colorSkylar = "rgb(185, 19, 70)";

    colorMidTerry = "rgb(160, 160, 160)";
    colorMidNicole = "rgb(45, 204, 80)";
    colorMidFamily = "rgb(255, 155, 63)";
    colorMidAddison = "rgb(73, 117, 255)";
    colorMidSkylar = "rgb(250, 49, 110)";

    getNextHour(h) {
        h += 1;
        if (h > 12) h -= 12;
        return h;
    }

    drawRects() {

        // background
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(51, 51, 51)";
        this.ctx.rect(1, 1, 1920, 550);
        this.ctx.fill();

        // 5 panels
        for (var i = 0; i < 5; i++) {
            this.drawRect(42 + i * 370, "rgb(69, 69, 69)");
        }
    }

    drawRect(x, fillColor) {
        this.ctx.beginPath();
        this.ctx.fillStyle = fillColor;
        this.ctx.roundRect(x, 5, 332, 507, 6);
        this.ctx.fill();
    }

    drawTimes() {
        var d = new Date();
        var y = this.nowLine + (60 - d.getMinutes()) * this.pixelsPerMin;
        var h = d.getHours();
        h = this.getNextHour(h);

        for (var i = 0; i < this.hoursVisible; i++) {

            // line
            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgb(95, 95, 95)";
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(9, y);
            this.ctx.lineTo(1900, y);
            this.ctx.stroke();

            // text
            var x = 14;
            var hString = h < 10 ? ' ' + h : '' + h;
            for (var j = 0; j < 6; j++) {
                this.ctx.beginPath();
                this.ctx.font = '18px Helvetica';
                this.ctx.strokeStyle = "rgb(51, 51, 51)";
                this.ctx.fillStyle = "rgb(218, 218, 218)";
                this.ctx.lineWidth = 10;
                this.ctx.strokeText(hString, x, y + 5);
                this.ctx.fillText(hString, x, y + 5);
                x += 370;
            }

            h = this.getNextHour(h);
            y += 60 * this.pixelsPerMin;
        }
    }

    drawNowLine() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(218, 218, 218)";
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(9, this.nowLine - 2);
        this.ctx.lineTo(1906, this.nowLine - 2);
        this.ctx.stroke();
    }

    drawHeader() {

        // cover existing drawing overflow
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(69, 69, 69)";
        this.ctx.roundRect(10, this.nowLine - 43, 1896, 40, 6);
        this.ctx.fill();

        // draw drop shadow
        this.ctx.beginPath();
        var grd = this.ctx.createLinearGradient(10, this.nowLine -1, 10, this.nowLine + 14);
        grd.addColorStop(0, "rgba(0, 0, 0, 0.4)");
        grd.addColorStop(1, "rgba(0, 0, 0, 0)");
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(10, this.nowLine - 2, 1869, 15);

        // colored family name headers
        this.ctx.beginPath();
        this.ctx.font = "Bold 26px Helvetica";
        
        this.ctx.fillStyle = this.colorMidTerry;
        this.ctx.fillText("Terry", 180, this.nowLine - 12);

        this.ctx.fillStyle = this.colorMidNicole;
        this.ctx.fillText("Nicole", 540, this.nowLine - 12);

        this.ctx.fillStyle = this.colorMidFamily;
        this.ctx.fillText("Family", 910, this.nowLine - 12);

        this.ctx.fillStyle = this.colorMidAddison;
        this.ctx.fillText("Addison", 1270, this.nowLine - 12);

        this.ctx.fillStyle = this.colorMidSkylar;
        this.ctx.fillText("Skylar", 1650, this.nowLine - 12);
    }

    drawEvent(x, color, startDate, endDate, summary) {
        var now = new Date(); // current time is 'now' line
         
        //                (  mins from now until event  )
        var eventStartInMins = Math.ceil((startDate - now) / 60000);
        var eventStartHoursOnly = Math.floor(eventStartInMins / 60);
        var eventStartMinsOnly = eventStartInMins - (eventStartHoursOnly * 60);
        var eventYStart = eventStartInMins * this.pixelsPerMin + this.nowLine;
        if (eventYStart > 500) return;
        var eventLengthMins = (endDate - startDate) / 60000;
        var eventHeight = (endDate - startDate) / 60000 * this.pixelsPerMin;

        // colored box
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, eventYStart, 332, eventHeight);
        this.ctx.fill();


        let optionsTime = {
            hour: "numeric", minute: "2-digit"
        };

        var remaining = eventStartHoursOnly > 0
            ? "in " + eventStartHoursOnly + "h " + eventStartMinsOnly + "m"
            : "in " + eventStartMinsOnly + "m";

        if (eventLengthMins >= 60) {
            // summary text
            this.ctx.beginPath();
            this.ctx.font = 'bold 15px Helvetica';
            this.ctx.fillStyle = "rgb(200, 200, 200)";
            this.ctx.fillText(summary, x + 8, eventYStart + 17);

            // start/stop times
            var startTime = startDate.toLocaleTimeString("en-us", optionsTime);
            var stopTime = endDate.toLocaleTimeString("en-us", optionsTime);
            this.ctx.font = 'bold 13px Helvetica';
            this.ctx.fillText(startTime + " - " + stopTime, x + 8, eventYStart + 35);

            if (eventStartInMins > 0) {
                // mins before start
                this.ctx.font = 'bold 20px Helvetica';
                this.ctx.fillText(remaining, x + 325 - this.getTextWidth(remaining), eventYStart + 28);
            }
        } else { // tiny box
            // summary text
            var startTime = startDate.toLocaleTimeString("en-us", optionsTime);
            this.ctx.beginPath();
            this.ctx.font = 'bold 15px Helvetica';
            this.ctx.fillStyle = "rgb(200, 200, 200)";
            this.ctx.fillText(summary + ", " + startTime, x + 8, eventYStart + 16);

            if (eventStartInMins > 0) {
                // mins before start
                this.ctx.font = 'bold 18px Helvetica';
                this.ctx.fillText(remaining, x + 325 - this.getTextWidth(remaining), eventYStart + 17);
            }
        }
    }

    getTextWidth(text) {
        return this.ctx.measureText(text).width;
    }
}