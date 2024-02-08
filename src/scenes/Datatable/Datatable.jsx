import "./datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { listColumns } from "./datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import AddPatient from "../AddPatients/AddPatient";

const Datatable = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
        //Listen to realtime data
        const unsub = onSnapshot(collection(db, "PatientList"), (snapShot) => {
          let list = [];
          snapShot.docs.forEach((doc) => {
              list.push({id: doc.id, ...doc.data()}); 
          });
          setData(list)
        }, (error)=>{
          console.log(error)
        });
        
        return () =>{
          unsub();
        }
    }, []);

    console.log(data)

    return (
        <div className="datatable">
          <div className="datatableTitle">
            Patient List
            <Link to="/addpatient" className="addpatient">
              + Add Patient
            </Link>
          </div>
          <DataGrid
            className="datagrid"
            rows={data}
            columns={listColumns}
            pageSize={2}
            rowsPerPageOptions={[8]}
            checkboxSelection
          />
        </div>
      );
};

export default Datatable;