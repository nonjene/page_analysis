import React from "react";
import {RadioGroup, Radio} from 'react-radio-group';
import DataList from './DataList';
import Summary from './Summary';
import ImageResult from './ImageResult';


const Size = {
    iphone: { width: 375, height: 667 },
    android: { width: 411, height: 731 },
    chrome: { width: 1330, height: 750 }
};
//tab style
const styGap = 18;
const styles = {
    flex: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row"

    },
    shot: {
        overflow: "hidden",
        marginRight: styGap
    },
    shotImg: {
        width: "100%"
    },
    btn: {
        cursor: 'pointer'
    },
    block: {
        paddingTop: styGap,
        paddingRight: styGap,
        paddingBottom: styGap,
        paddingLeft: styGap,
        marginTop: styGap,
        marginRight: styGap,
        marginBottom: styGap,
        marginLeft: styGap,
        backgroundColor: '#fafafa',
        borderColor: '#f6f6f6',
        borderStyle: "solid",
        borderWidth: 1,
        boxShadow: '0 4px 12px #ddd'
    }
};

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            addr: 'https://m.ppmoney.com',
            device: "iphone",
            resData: {
                aPicName: [],
                DOMContentLoaded: '',
                onLoaded: '',
                summary: []
            },
            screenShotSize: {
                width: Size.iphone.width / 2,
                height: Size.iphone.height / 2,
            }
        };
    }
    componentDidMount() {

    }
    submit() {
        let body = [
            "addr=" + encodeURIComponent(this.state.addr),
            "device=" + this.state.device
        ].join("&");

        fetch("/api/test", {
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body
        }).then(res => res.json()).then(resData => {
            console.log(resData);
            this.setState({ resData });
        });
    }
    onChangeAddr(e) {
        this.setState({
            addr: e.target.value
        });
    }
    onChangeDevice(device) {
        let multiple = device === "chrome" ? 3 : 2;
        this.setState({
            device,
            screenShotSize: {
                width: Size[device].width / multiple,
                height: Size[device].height / multiple,
            }
        });
    }
    renderScreenShot() {
        const styImgWrap = Object.assign({}, styles.shot, this.state.screenShotSize);

        return this.state.resData.aPicName
            .sort((a, b) => a.time > b.time)
            .map(item => {
                return (
                    <div key={item.time}>
                        <div>
                            ↓{item.time}ms
                        </div>
                        <div style={styImgWrap}>
                            <img style={styles.shotImg} src={item.addr}/>
                        </div>

                    </div>
                );
            });
    }
    render() {
        return (
            <div>
                <form style={styles.block}>
                    <div>
                        <label>网址：
                            <input
                                value={this.state.addr}
                                onChange={this.onChangeAddr.bind(this) }
                                type="text"
                                placeholder="https://example.com"/>
                        </label>
                        <button style={styles.btn} type="button" onClick={this.submit.bind(this) }>测试</button>
                    </div>
                    <div>
                        设备：
                        <RadioGroup
                            name="device"
                            selectedValue={this.state.device}
                            onChange={this.onChangeDevice.bind(this) }
                            >
                            <label><Radio value="iphone" />iphone
                            </label>
                            <label><Radio value="android" />android</label>
                            <label><Radio value="chrome" />chrome</label>
                        </RadioGroup>
                    </div>
                    <div style={styles.flex}>
                        <p>宽: {Size[this.state.device].width}</p>
                        <p>高: {Size[this.state.device].height}</p>
                    </div>
                </form>

                <div style={styles.block}>
                    <p>代码加载完(Dom ready): {this.state.resData.DOMContentLoaded}ms, 完全加载完(on loaded): {this.state.resData.onLoaded}ms</p>

                    <div style={styles.flex}>{this.renderScreenShot() }</div>
                </div>

                <div style={styles.block}>
                    <Summary summary={this.state.resData.summary.summary}/>
                </div>
                <div style={styles.block}>
                    <ImageResult analysis={this.state.resData.analysis} />
                </div>
                <div style={styles.block}>
                    <DataList list={this.state.resData.summary.list}/>
                </div>

            </div>
        );
    }

}