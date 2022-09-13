import React from "react";
import PropTypes from "prop-types";
import { Table } from "reactstrap";

import "./PaymentRecords.css";

const PaymentRecords = ({ paymentRecords }) => {
    
    return (
        <div className="table-holder overflow-auto">
            <Table responsive>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentRecords.map(paymentRecord => {
                        return (
                            <tr>
                                <td>{paymentRecord.fromName}</td>
                                <td>{paymentRecord.toName}</td>
                                <td>{paymentRecord.formattedAmountPaid}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

PaymentRecords.propTypes = {
    paymentRecords: PropTypes.arrayOf({
        fromName: PropTypes.string.isRequired,
        toName: PropTypes.string.isRequired,
        formattedAmountPaid: PropTypes.string.isRequired
    }).isRequired
};

export default PaymentRecords;
