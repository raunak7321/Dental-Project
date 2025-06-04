const ShowRecords = ({ procedureList, setProcedureList }) => {

  const handleDeleteProcedure = (index) => {
    const updatedList = [...procedureList];
    updatedList.splice(index, 1);
    setProcedureList(updatedList);
  };

  if (procedureList.length === 0) return null;

  return (
    <table className="w-full text-base mb-8 border border-gray-200 shadow-sm rounded overflow-hidden mt-6">
      <thead className="bg-teal-100 text-gray-700 uppercase text-sm">
        <tr>
          <th className="p-3 text-left">Procedure</th>
          <th className="p-3 text-left">Treatment</th>
          <th className="p-3 text-left">Sitting Required</th>
          <th className="p-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {procedureList.map((item, i) => (
          <tr
            key={i}
            className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-teal-50 transition-colors`}
          >
            <td className="p-3">{item.procedure}</td>
            <td className="p-3">{item.treatment}</td>
            <td className="p-3">{item.sitting}</td>
            <td
              className="p-3 text-red-500 hover:text-red-700 cursor-pointer transition-colors"
              onClick={() => handleDeleteProcedure(i)}
            >
              Delete
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShowRecords;