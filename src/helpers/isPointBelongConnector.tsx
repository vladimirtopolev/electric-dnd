import {ConnectorPoint, Connector} from "../types";

export default (point: ConnectorPoint, connector: Connector): boolean => {
    return (connector.first.element.id === point.element.id
        && connector.first.connectorPointIndex === point.connectorPointIndex)
        || (connector.second.element.id === point.element.id
            && connector.second.connectorPointIndex === point.connectorPointIndex);
}
