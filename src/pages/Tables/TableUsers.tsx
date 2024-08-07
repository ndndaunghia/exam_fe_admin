import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableOne from '../../components/Tables/TableOne';

const TableUsers = () => {
  return (
    <>
      <Breadcrumb pageName="Table Users" />

      <div className="flex flex-col gap-10">
        <TableOne />
        {/* <TableTwo />
        <TableThree /> */}
      </div>
    </>
  );
};

export default TableUsers;
