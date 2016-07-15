import React from "react";

import {Styles} from "./Styles";

export default class Summary extends React.Component {
    constructor(props) {
        super(props);

    }
    renderSummary() {
        if (!this.props.summary) { return; }
        var data = this.props.summary.map(item => {
            return (
                <tr key={item.name} style={Styles.cell}>
                    <td style={Styles.cell}>{item.name}</td>
                    <td style={Styles.cell}>{item.val}</td>
                    <td style={Styles.cell}>{item.point}</td>
                </tr>
            );
        });
        if (data.length > 0) {
            data.unshift(
                <tr style={Styles.cell} key="head">
                    <td style={Styles.cell}>数据名</td>
                    <td style={Styles.cell}>值</td>
                    <td style={Styles.cell}>对应资源</td>
                </tr>
            );
        }
        return data;

    }
    render() {
        return (
            <div>
                <table style={Styles.table}>
                    <tbody>
                        {this.renderSummary() }
                    </tbody>
                </table>
            </div>
        );
    }
}
Summary.defaultProps = {
    summary: []
};