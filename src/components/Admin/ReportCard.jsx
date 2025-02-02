const ReportCard = ({ report }) => {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-md font-semibold">{report.title}</h3>
        <p>{report.description}</p>
      </div>
    );
  };
  
  export default ReportCard;
  