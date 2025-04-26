import DataTableComp from "./DataTable";
import LayoutWrapper from "./LayoutWrapper";

const AuditLogs = () => {
  return (
    <LayoutWrapper>
      <div className="flex flex-col justify-start items-start w-full">
        <div className="flex flex-col justify-start items-start w-full">
          <h1 className="text-blue-600 text-xl capitalize font-semibold">
            audit logs
          </h1>
          <div className="w-full mt-5">
            <DataTableComp />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default AuditLogs;
