import DataTable from "react-data-table-component";
import { DataTableProps } from "../utils";
import { useContextHook } from "../context/Context";

const columns = [
  {
    name: "Date and Time",
    selector: (row: DataTableProps) =>
      row?.timestamp?.toLocaleString() ?? "N/A",
  },
  {
    name: "Role",
    selector: (row: DataTableProps) => row?.userRole ?? "N/A",
  },
  {
    name: "Action Done",
    selector: (row: DataTableProps) => row?.action ?? "N/A",
  },
  {
    name: "User Id",
    selector: (row: DataTableProps) => row?.userId ?? "N/A",
  },
  {
    name: "Event Id",
    selector: (row: DataTableProps) => row?.event?.id ?? "N/A",
  },
  {
    name: "Event Title",
    selector: (row: DataTableProps) => row?.event?.title ?? "N/A",
  },
];

export default function DataTableComp() {
  const { auditLogsData } = useContextHook();
  return <DataTable columns={columns} data={auditLogsData} />;
}
