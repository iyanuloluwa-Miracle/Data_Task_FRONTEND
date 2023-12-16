import React, { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { getData, postData, updateData } from "../../services/ApiCalls";

const Form = () => {
  const [name, setName] = useState("");
  const [sectors, setSectors] = useState([]);
  const [options, setOptions] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const userId = localStorage.getItem("userMgmtUserId");

  const getOptions = useCallback(async () => {
    const data = await getData("sectors");
    setOptions(data);
  }, []);

  const getStoredData = useCallback(async () => {
    const data = await getData(`users/${userId}`);
    console.log(data);
    setSectors(data?.sectors);
    setName(data?.name);
    setAgreeToTerms(data?.agreeToTerms);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form);
    const userData = { ...formData, sectors };
    try {
      setIsLoading(true);
      const data = await postData("users", userData);
      localStorage.setItem("userMgmtUserId", data.userId);
    } catch (error) {
      console.error(error.message);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form);
    const userData = { ...formData, sectors };
    try {
      setIsLoading(true);
      await updateData(`users/${userId}`, userData);
    } catch (error) {
      console.error(error.message);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addValue = (e) => {
    const selectedOption = e.target.value;
    setSectors((prevValues) =>
      prevValues.includes(selectedOption)
        ? prevValues.filter((value) => value !== selectedOption)
        : [...prevValues, selectedOption]
    );
  };

  useEffect(() => {
    getOptions();
    getStoredData();
  }, []);

  if (!userId) {
    return (
      <>
       <form onSubmit={handleCreate}>
        <div className="col_container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required />
        </div>
        <div className="col_container">
          <label htmlFor="sectors">Sectors</label>
          <select
            name="sectors"
            id="sectors"
            multiple
            required
            value={sectors}
            onChange={(e) => addValue(e)}
          >
            {options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="checkbox"
            name="agreeToTerms"
            id="agree"
            value={true}
            required
          />
          <label htmlFor="agree">Agree to terms</label>
        </div>
        <div>
          <button>{isLoading ? "Saving ..." : "Save"}</button>
        </div>
        <p>{message}</p>
      </form>
      </>
      
     
    );
  } else {
    return (
      <form onSubmit={handleUpdate}>
        <div className="col_container">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col_container">
          <label htmlFor="sectors">Sectors</label>
          <select
            name="sectors"
            id="sectors"
            multiple
            required
            value={sectors}
            onChange={(e) => addValue(e)}
          >
            {options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="checkbox"
            name="agreeToTerms"
            id="agree"
            value={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            checked={agreeToTerms}
            required
          />
          <label htmlFor="agree">Agree to terms</label>
        </div>
        <div>
          <button>{isLoading ? "Updating ..." : "Update"}</button>
        </div>
        <p>{message}</p>
      </form>
    );
  }
};

export default Form;
