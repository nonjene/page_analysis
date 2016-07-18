/**
 * Created by Nonjene on 16/7/19.
 */

import React from "react";
import {Styles} from "./Styles";


export default class ImageResult extends React.Component {
    constructor(props) {
        super(props);

    }
    renderTable(){
        let data = this.props.analysis.filter(item=>item.slug==='image')[0];
        if(!data){
            return;
        }
        let zipName = data.zip.split('/').slice(-1).pop();

        return (
            <table style={Styles.table}>
                <tbody>
                    <tr style={Styles.cell}>
                        <td style={Styles.cell}>{data.desc}</td>
                        <td style={Styles.cell}>详细</td>
                        <td style={Styles.cell}>下载优化后的图片</td>
                    </tr>
                    <tr style={Styles.cell}>
                        <td style={Styles.cell}>{data.score}分</td>
                        <td style={Styles.cell}>
                            图片总大小:{data.allOriImgSize}KB,可减少{data.allOriImgSize-data.allOptImgSize}KB
                        </td>
                        <td style={Styles.cell}><a href={data.zip}>{zipName}</a></td>
                    </tr>
                </tbody>
            </table>
        )
    }
    render() {
        return (
            <div>
                {this.renderTable()}
            </div>
        );
    }
}
ImageResult.defaultProps = {
    analysis: []
};