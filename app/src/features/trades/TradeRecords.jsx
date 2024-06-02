import React from "react";
import PropTypes from "prop-types";
import { Table, Button } from "reactstrap";

const TradeRecords = ({
  tradeRecords,
  viewSelectedTradeFunction,
  isRequested
}) => {
  return (
    <div className="overflow-auto">
      <Table responsive>
        <thead>
          <tr>
            <th>Trade ID</th>
            <th>{isRequested ? "Requested By" : "Proposed To"}</th>
          </tr>
        </thead>
        <tbody>
          {tradeRecords.map((tradeRecord) => {
            return (
              <tr key={`trade-record-key-${tradeRecord.tradeId}`}>
                <td>
                  <Button
                    color="link"
                    onClick={() =>
                      viewSelectedTradeFunction(tradeRecord.tradeId)
                    }
                  >
                    {tradeRecord.tradeId}
                  </Button>
                </td>
                <td>{tradeRecord.playerName}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

TradeRecords.defaultProps = {
  isRequested: false
};

TradeRecords.propTypes = {
  tradeRecords: PropTypes.arrayOf(
    PropTypes.shape({
      tradeId: PropTypes.number.isRequired,
      playerName: PropTypes.string.isRequired
    })
  ).isRequired,
  viewSelectedTradeFunction: PropTypes.func.isRequired,
  isRequested: PropTypes.bool
};

export default TradeRecords;
