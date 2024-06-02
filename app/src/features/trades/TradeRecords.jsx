import React from "react";
import PropTypes from "prop-types";
import { Table, Button } from "reactstrap";

const TradeRecords = ({
  tradeRecords,
  viewSelectedTradeFunction,
  cancelSelectedTradeFunction,
  isRequested
}) => {
  return (
    <div className="overflow-auto">
      <Table responsive>
        <thead>
          <tr>
            <th>Trade ID</th>
            <th>{isRequested ? "Requested By" : "Proposed To"}</th>
            {!isRequested && <th>Actions</th>}
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
                {!isRequested && (
                  <td>
                    <Button
                      color="danger"
                      onClick={() =>
                        cancelSelectedTradeFunction(tradeRecord.tradeId)
                      }
                    >
                      Cancel
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

TradeRecords.defaultProps = {
  cancelSelectedTradeFunction: () => {
    /* noop */
  },
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
  cancelSelectedTradeFunction: PropTypes.func,
  isRequested: PropTypes.bool
};

export default TradeRecords;
