
/**/

/**
Age:3188989
Cache-Control:max-age=315360000
Connection:keep-alive
Content-Encoding:gzip
Content-Length:2226
ETag:"3513-534aa93c81000"
Expires:Fri, 05 Jun 2026 08:45:10 GMT
Last-Modified:Tue, 07 Jun 2016 06:48:32 GMT
Status Code
 * 
 */

import React from "react";
import {Styles} from "./Styles";

export default class DataList extends React.Component {
    constructor(props) {
        super(props);

    }
    renderList() {
        var list = this.props.list;
        if (!list) { return; }
        //console.log(this.props.summary.list)
        var data = this.props.list
            .filter(item => !!item)
            .sort((a, b) => (+b.size - (+a.size)))
            .map((item,key) => {
                ++key;
                return (
                    <tr key={key} style={Styles.cell}>
                        <td style={Styles.cell}>{key}</td>
                        <td style={Styles.cell}>{item.id}</td>
                        <td style={Styles.cell}>{item.time}ms</td>
                        <td style={Styles.cell}>{item.size}KB</td>
                        <td style={Styles.cell}>{item.type}</td>
                        <td style={Styles.cell}>{item.url}</td>
                    </tr>
                );
            });
        if (data.length > 0) {
            data.unshift(
                <tr style={Styles.cell} key="head">
                    <td style={Styles.cell}>序号</td>
                    <td style={Styles.cell}>请求次序</td>
                    <td style={Styles.cell}>耗时</td>
                    <td style={Styles.cell}>大小</td>
                    <td style={Styles.cell}>类型</td>
                    <td style={Styles.cell}>链接</td>
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
                        {this.renderList() }
                    </tbody>
                </table>
            </div>
        );
    }
}
DataList.defaultProps = {
    list: []
};
