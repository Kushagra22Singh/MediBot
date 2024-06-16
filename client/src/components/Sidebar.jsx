import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from ".";
import { useDispatch, useSelector } from "react-redux";
import { currentUserAPI } from "@/store/services/userAction";
import { X } from "lucide-react";
import axios from "axios";

function Sidebar() {
  const dispatch = useDispatch();
  const userQueries = useSelector((state) => state.user.userInfo?.userQueries);
  const loading = useSelector((state) => state.user.loading);
  const reversedQueries = userQueries?.slice().reverse();
  const [success, setSuccess] = useState(false);

  const deleteQuery = async (id) => {
    const response = await axios.delete(
      `http://localhost:8000/api/v1/delete-query/${id}`,
      { withCredentials: true }
    );
    setSuccess(true);
  };

  useEffect(() => {
    if (success) {
      dispatch(currentUserAPI());
      setSuccess(false);
    }
  }, [deleteQuery]);
  useEffect(() => {
    if (loading) {
      dispatch(currentUserAPI());
    }
  }, [loading]);
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 text-xl font-bold tracking-tight">
          Previous Diagnosis
        </div>
        <div className="overflow-y-auto px-2">
          {!userQueries || userQueries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-4">
              <p className="text-center text-muted-foreground text-lg">
                You don't have any previous diagnoses yet.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {reversedQueries?.map((query) => (
                <AccordionItem key={query._id} value={query._id}>
                  <AccordionTrigger
                    button={
                      <X
                        className="h-3 w-3 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuery(query._id);
                        }}
                      />
                    }
                  >
                    {query.prediction}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul
                      style={{
                        listStyleType: "disc",
                        paddingLeft: "1.5rem",
                      }}
                    >
                      {query.symptoms?.map((symptomArray, idx) =>
                        JSON.parse(symptomArray).map((symptom, symptomIdx) => (
                          <li key={symptomIdx}>{symptom}</li>
                        ))
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
