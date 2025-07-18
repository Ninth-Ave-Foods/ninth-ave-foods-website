"use client";

import { FormEvent, useState, useEffect } from "react";
import ErrorAlert from "@/partials/ErrorAlert";
import SubmissionMessage from "@/partials/SubmissionMessage";
import { Dict } from "styled-components/dist/types";

// Dynamic employment experience
type EmploymentExperience = {
  nameofEmployer: string;
  supervisor: string;
  employerAddress: string;
  employerPhone: string;
  dateEmployedFrom: string;
  dateEmployedTo: string;
  employerContact: string;
  jobTitleAndDuties: string;
  reasonForLeaving: string;
};

type EmploymentExperienceList = EmploymentExperience[];

const EmployeeApplicationForm = ({
  jobPositionID,
  jobTitle,
  jobLocation,
}: {
  jobPositionID: string;
  jobTitle: string;
  jobLocation: string;
}) => {
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isCreateEmployeeAppSuccessful, setIsCreateEmployeeAppSuccessful] =
    useState<boolean>(true);
  const [createEmployeeAppErrorMsg, setCreateEmployeeAppErrorMsg] =
    useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // const [success, setSucess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Dict>({});
  const [employmentExpFormErrors, setEmploymentExpFormErrors] = useState<Dict>(
    {},
  );
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [selectedRadioBtn, setSelectedRadioBtn] = useState<Dict>({
    radioSet1: [false, false],
    radioSet2: [false, false],
    radioSet3: [false, false],
    radioSet4: [false, false],
    radioSet5: [false, false],
    radioSet6: [false, false],
    radioSet7: [false, false],
    radioSet8: [false, false],
    radioSet9: [false, false],
    radioSet10: [false, false],

    radioSet11: [false, false],
    radioSet12: [false, false],
    radioSet13: [false, false],
  });
  const [selectedEmploymentRadioBtn, setSelectedEmploymentRadioBtn] =
    useState<Dict>({
      radioSet0: [false, false],
      radioSet1: [false, false],
      radioSet2: [false, false],
      radioSet3: [false, false],
      radioSet4: [false, false],
    });
  const [employmentPhoneNumber, setEmploymentPhoneNumber] = useState<Dict>({
    phone0: "",
    phone1: "",
    phone2: "",
    phone3: "",
    phone4: "",
  });
  const [employmentExperiences, setEmploymentExperiences] =
    useState<EmploymentExperienceList>([]);

  const [isEmploymentCardCreated, setIsEmploymentCardCreated] = useState<
    boolean[]
  >(Array(employmentExperiences.length).fill(false));
  const [selectedCheckBox, setSelectedCheckBox] = useState<boolean[]>(
    Array(7).fill(false),
  );
  const [selectedCheckBox2, setSelectedCheckBox2] = useState<boolean[]>(
    Array(6).fill(false),
  );
  const [isRequired, setIsRequired] = useState<boolean>(false);
  const [isRequired2, setIsRequired2] = useState<boolean>(false);

  useEffect(() => {
    // Handles case where there is orginally one employment card on page mount
    if (employmentExperiences.length === 1) {
      setIsEmploymentCardCreated([true]);
    }
  }, [employmentExperiences.length]);

  // useEffect(() => {
  //   console.log("Phone: ", phone);
  //   console.log("Email: ", email);
  //   console.log("Selected Radio Btn: ", selectedRadioBtn);
  //   console.log("Selected Checkbox: ", selectedCheckBox);
  //   console.log("Employment Phone Number: ", employmentPhoneNumber);
  // }, [
  //   phone,
  //   email,
  //   selectedRadioBtn,
  //   selectedEmploymentRadioBtn,
  //   selectedCheckBox,
  //   employmentPhoneNumber,
  // ]);

  const validateCheckBoxes = (): boolean => {
    if (!selectedCheckBox.includes(true)) {
      // Add previous list of errors along with checkbox error
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        checkbox: "Pick at least one checkbox",
      }));
      return false;
    }
    setFormErrors((prevErrors) => {
      const { radio, ...rest } = prevErrors;
      return rest;
    });
    return true;
  };

  const validateRadioBtns = (): boolean => {
    const validateEmploymentRadioBtnSets = (): boolean => {
      let isValid = true;
      Object.keys(selectedEmploymentRadioBtn).forEach((setName, index) => {
        const radioSet = selectedEmploymentRadioBtn[setName];

        // Validate only if the employment card is created
        if (isEmploymentCardCreated[index]) {
          const errorKey = `radio${index}`;

          if (!radioSet || !radioSet.includes(true)) {
            isValid = false;
            setEmploymentExpFormErrors((prevErrors) => ({
              ...prevErrors,
              [errorKey]: "Pick one radio button",
            }));
          } else {
            setEmploymentExpFormErrors((prevErrors) => {
              const { [errorKey]: _, ...rest } = prevErrors;
              return rest;
            });
          }
        }
      });
      return isValid;
    };

    const validateRadioBtnSet = (
      radioSet: boolean[],
      setName: string,
      errorKey: string,
    ): boolean => {
      if (!radioSet.includes(true)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [errorKey]: "Pick one radio button",
        }));
        return false;
      } else {
        setFormErrors((prevErrors) => {
          const { [errorKey]: _, ...rest } = prevErrors;
          return rest;
        });
        return true;
      }
    };

    // Validate static radio buttons
    const isRadioSet1Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet1"],
      "radioSet1",
      "radio1",
    );

    const isRadioSet2Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet2"],
      "radioSet2",
      "radio2",
    );
    const isRadioSet3Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet3"],
      "radioSet3",
      "radio3",
    );
    const isRadioSet4Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet4"],
      "radioSet4",
      "radio4",
    );
    const isRadioSet5Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet5"],
      "radioSet5",
      "radio5",
    );
    const isRadioSet11Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet11"],
      "radioSet11",
      "radio11",
    );
    const isRadioSet12Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet12"],
      "radioSet12",
      "radio12",
    );
    const isRadioSet13Valid = validateRadioBtnSet(
      selectedRadioBtn["radioSet13"],
      "radioSet13",
      "radio13",
    );

    // Validate dynamic radio buttons
    const isRadioSetsValid = validateEmploymentRadioBtnSets();

    return (
      isRadioSet1Valid &&
      isRadioSet2Valid &&
      isRadioSet3Valid &&
      isRadioSet4Valid &&
      isRadioSet5Valid &&
      isRadioSet11Valid &&
      isRadioSet12Valid &&
      isRadioSet13Valid &&
      isRadioSetsValid
    );
  };

  const validateForm = (): boolean => {
    let formErrors: { [key: string]: string } = {};
    let employmentExpFormErrors: { [key: string]: string } = {};
    let phoneRegex = new RegExp(
      /^(\+1\s?)?(\(?\d{3}\)?[\s-]?)\d{3}[\s-]?\d{4}$/,
    );

    if (phone && !phoneRegex.test(phone)) {
      formErrors.phone = "Invalid phone number";
    }

    // For employment experience phone numbers
    Object.keys(employmentPhoneNumber).forEach((setName, index) => {
      const phone = employmentPhoneNumber[setName];

      // Validate only if the employment card is created
      if (isEmploymentCardCreated[index]) {
        const errorKey = `phone${index}`;

        if (phone && !phoneRegex.test(phone)) {
          employmentExpFormErrors[errorKey] = "Invalid phone number";
          setEmploymentExpFormErrors((prevErrors) => ({
            ...prevErrors,
            [errorKey]: "Invalid phone number",
          }));
        } else {
          setEmploymentExpFormErrors((prevErrors) => {
            const { [errorKey]: _, ...rest } = prevErrors;
            return rest;
          });
        }
      }
    });

    // Add any errors from the employment experiences
    if (Object.keys(employmentExpFormErrors).length > 0) {
      formErrors = { ...formErrors, ...employmentExpFormErrors };
    }

    setFormErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      return true;
    }
    return false;
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    // Run validation
    const isFormValid = validateForm();
    const isRadioBtnsValid = validateRadioBtns();
    const isCheckBoxesValid = validateCheckBoxes();

    // Check for errors after validation
    if (!isRadioBtnsValid || !isCheckBoxesValid || !isFormValid) {
      setError("Fix form errors before submitting!");
      setIsFormValid(false);
      setLoading(false);
      return false;
    }

    try {
      // Create FormData from the event target
      const formData = new FormData(event.currentTarget);

      // Prepare the employment experiences array
      const experiences = employmentExperiences.map((experience, index) => {
        // Add the employerContact values based on the index
        const employerContactValue = formData.get(
          `employerContact${index}`,
        ) as string;
        const employerPhoneValue = formData.get(
          `employerPhone${index}`,
        ) as string;

        return {
          nameofEmployer: experience.nameofEmployer,
          supervisor: experience.supervisor,
          employerAddress: experience.employerAddress,
          employerPhone: employerPhoneValue,
          dateEmployedFrom: experience.dateEmployedFrom,
          dateEmployedTo: experience.dateEmployedTo,
          employerContact: employerContactValue,
          jobTitleAndDuties: experience.jobTitleAndDuties,
          reasonForLeaving: experience.reasonForLeaving,
        };
      });

      // Append the experiences array as a JSON string to the formData
      formData.append("employmentExperiences", JSON.stringify(experiences));
      formData.append("jobPositionID", jobPositionID); // Add this data to be connected content
      formData.append("jobTitle", jobTitle);
      formData.append("jobLocation", jobLocation);

      // Submit the form data
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // assuming the API sends back JSON error response
        const errorMessage =
          errorResponse.message ||
          "Error submitting application. Please try again later.";

        // Display errors to user
        setError(errorMessage);
        setCreateEmployeeAppErrorMsg(errorMessage);
        setIsCreateEmployeeAppSuccessful(false);
      } else {
        setFormSubmitted(true); // Show the overlay after success
        setIsFormValid(true);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message); // Capture the error message to display to the user
    } finally {
      setLoading(false);
    }
  }

  const handleAddExperience = () => {
    if (employmentExperiences.length < 5) {
      validateForm();

      const newIndex = employmentExperiences.length;

      // Add the new employment experience
      setEmploymentExperiences([
        ...employmentExperiences,
        {
          nameofEmployer: "",
          supervisor: "",
          employerAddress: "",
          employerPhone: "",
          dateEmployedFrom: "",
          dateEmployedTo: "",
          employerContact: "",
          jobTitleAndDuties: "",
          reasonForLeaving: "",
        },
      ]);

      // Add a new radio button state for the new experience
      setSelectedEmploymentRadioBtn((prevState) => ({
        ...prevState,
        [`radioSet${newIndex}`]: [false, false],
      }));

      // Add a new phone number for the new experience
      setEmploymentPhoneNumber((prevState) => ({
        ...prevState,
        [`phone${newIndex}`]: "",
      }));

      // Mark the new employment card as created and log the updated state
      setIsEmploymentCardCreated((prevState) => {
        const updatedState = [...prevState];
        updatedState[newIndex] = true;
        return updatedState;
      });
    } else {
      alert("You can only add up to 5 employment experiences");
    }
  };

  function handleInputChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setEmploymentExperiences((prevState) => {
      const updatedExperiences = [...prevState];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [name]: value,
      };
      return updatedExperiences;
    });
  }

  const handleDeleteExperience = (index: number) => {
    // Copy the existing radio button states
    const updatedSelectedRadioBtn = { ...selectedEmploymentRadioBtn };

    // Remove the radio button set associated with the deleted card
    delete updatedSelectedRadioBtn[`radioSet${index}`];

    // Adjust the keys for the remaining radio button sets
    Object.keys(updatedSelectedRadioBtn)
      .sort(
        (a, b) =>
          parseInt(a.replace("radioSet", "")) -
          parseInt(b.replace("radioSet", "")),
      )
      .forEach((key, i) => {
        const currentKey = key;
        const nextKey = `radioSet${i}`;

        if (currentKey !== nextKey) {
          updatedSelectedRadioBtn[nextKey] =
            updatedSelectedRadioBtn[currentKey];
          delete updatedSelectedRadioBtn[currentKey];
        }
      });

    // Update the state with the modified radio button states
    setSelectedEmploymentRadioBtn(updatedSelectedRadioBtn);

    // Handle phone number deletion and reindexing
    setEmploymentPhoneNumber((prevPhoneNumbers) => {
      const updatedPhoneNumbers = { ...prevPhoneNumbers };
      delete updatedPhoneNumbers[`phone${index}`];

      // Adjust the keys for the remaining phone numbers
      const sortedKeys = Object.keys(updatedPhoneNumbers).sort(
        (a, b) =>
          parseInt(a.replace("phone", "")) - parseInt(b.replace("phone", "")),
      );

      const reindexedPhoneNumbers = sortedKeys.reduce((acc, key, i) => {
        acc[`phone${i}`] = updatedPhoneNumbers[key];
        return acc;
      }, {} as Dict);

      return reindexedPhoneNumbers;
    });

    // Update the employment experiences
    setEmploymentExperiences((prevState) => {
      return prevState.filter((_, i) => i !== index);
    });

    // Update the isEmploymentCardCreated state
    setIsEmploymentCardCreated((prevState) => {
      const updatedState = [...prevState];
      updatedState.splice(index, 1);
      return updatedState;
    });

    // Revalidate after deletion
    validateRadioBtns();
    validateForm();
  };

  return (
    <>
      <section>
        <div className="animate-fade ease-in mx-auto">
          {isFormSubmitted && (
            <SubmissionMessage
              title="Thank you for submitting"
              return_to_link="/career"
              image="/images/send-mail.png"
              message="Your form submission has been received."
              submessage="We will be in touch with you shortly."
            />
          )}
          {!isCreateEmployeeAppSuccessful && (
            <SubmissionMessage
              title="Error submitting application"
              return_to_link="/career"
              image="/images/error_message.png"
              message={createEmployeeAppErrorMsg}
              submessage="We apologize for the inconvenience."
            />
          )}

          <form onSubmit={onSubmit} method="POST">
            <div className="flex flex-wrap">
              <div className="flex-col w-full">
                <div className="w-full md:mb-6 mb-3">
                  <label
                    htmlFor="dateOfApplication"
                    className="form-label text-dark-grey"
                  >
                    Date of Application <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfApplication"
                    name="dateOfApplication"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 md:w-1/3 xl:w-1/5 w-2/3 h-12 border-mischka"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    required
                  />
                </div>

                <div className="flex md:flex-row flex-col">
                  <div className="w-full xl:w-1/4 lg:w-1/2 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="fname"
                      className="form-label text-dark-grey"
                    >
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fname"
                      name="fname"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      placeholder="First name"
                      type="text"
                      required
                    />
                  </div>

                  <div className="w-full xl:w-1/4 lg:w-1/2 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="mname"
                      className="form-label text-dark-grey"
                    >
                      Middle name
                    </label>
                    <input
                      id="mname"
                      name="mname"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      placeholder="Middle name"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-1/4 lg:w-1/2 md:mb-6 mb-3">
                    <label
                      htmlFor="lname"
                      className="form-label text-dark-grey"
                    >
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lname"
                      name="lname"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      placeholder="Last name"
                      type="text"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="w-full md:mb-6 mb-3">
                <label className="form-label text-dark-grey">Address</label>

                <div className="flex flex-col">
                  <input
                    id="address1"
                    name="address1"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full xl:w-1/3 md:w-3/5 h-12 border-mischka"
                    placeholder="Street Address"
                    type="text"
                  />
                  <input
                    id="address2"
                    name="address2"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full xl:w-1/3 md:w-3/5 h-12 border-mischka mt-3"
                    placeholder="Street Address line 2 (optional)"
                    type="text"
                  />
                </div>

                <div>
                  <input
                    id="city"
                    name="city"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-3/5 xl:w-1/6 lg-w-1/5 md:w-1/4  h-12 border-mischka mt-3 mr-3"
                    placeholder="City"
                  />

                  <select
                    id="state"
                    name="state"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-3/5 xl:w-1/6 lg-w-1/5 md:w-1/4 border-mischka mt-3 mr-3"
                    defaultValue="State"
                  >
                    <option value="State" disabled hidden>
                      State
                    </option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>

                <input
                  id="zipcode"
                  name="zipcode"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-3/5 xl:w-1/6 lg-w-1/5 md:w-1/4 h-12 border-mischka mt-3"
                  placeholder="Zip Code"
                  type="text"
                  maxLength={5}
                  pattern="[0-9]{5}"
                />
              </div>

              <div className="w-full lg:w-1/3 md:w-1/2 md:mb-6 mb-3 pr-3">
                <label htmlFor="phone" className="form-label text-dark-grey">
                  Phone number <span className="text-red-500">*</span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  placeholder="+ 1 (123) 456-7891"
                  type="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {formErrors.phone && (
                  <p className="text-red-500">{formErrors.phone}</p>
                )}
              </div>

              <div className="w-full lg:w-1/3 md:w-1/2 md:mb-6 mb-3">
                <label htmlFor="email" className="form-label text-dark-grey">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  placeholder="john.doe@email.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* EMPLOYMENT DESIRED */}
              <h5 className="text-dark-grey pt-10 w-full">
                EMPLOYMENT DESIRED
              </h5>
              <hr className="w-full h-[1px] bg-dark-grey my-6" />

              <div className="w-full md:w-1/2 md:mb-6 mb-3">
                <label
                  htmlFor="positions"
                  className="form-label text-dark-grey"
                >
                  Position(s) Applying For{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="positions"
                  name="positions"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  placeholder=""
                  type="text"
                  required
                />
              </div>

              <div className="w-full lg:w-2/5 lg:px-30 mb-3 lg:ml-10">
                <label className="form-label text-dark-grey">
                  Are you applying for? <span className="text-red-500">*</span>
                </label>

                {/* Radio buttons */}
                <div className="flex flex-row items-center md:space-x-10 space-x-3">
                  <div className="flex flex-row items-center">
                    <input
                      id="fullTime"
                      name="employeeType"
                      value="Regular Full Time Work"
                      type="radio"
                      className="mr-1"
                      checked={selectedRadioBtn["radioSet1"][0]}
                      onChange={() =>
                        setSelectedRadioBtn({
                          ...selectedRadioBtn,
                          radioSet1: [true, false],
                        })
                      }
                    />
                    <label htmlFor="fullTime"> Regular Full Time Work</label>
                  </div>

                  <div className="flex flex-row items-center">
                    <input
                      id="partTime"
                      name="employeeType"
                      value="Regular Part Time Work"
                      type="radio"
                      className="md:ml-4 mr-1"
                      checked={selectedRadioBtn["radioSet1"][1]}
                      onChange={() =>
                        setSelectedRadioBtn({
                          ...selectedRadioBtn,
                          radioSet1: [false, true],
                        })
                      }
                    />
                    <label htmlFor="partTime"> Regular Part Time Work</label>
                  </div>
                </div>

                {formErrors.radio1 && (
                  <p className="text-red-500">{formErrors.radio1}</p>
                )}
              </div>

              <div className="w-full md:mb-6 mb-3">
                <label
                  htmlFor="availability"
                  className="form-label text-dark-grey"
                >
                  What days and hours are you available for work?{" "}
                  <span className="text-red-500">*</span>
                </label>

                {/* Check box buttons */}
                <div className="flex flex-row items-center pt-2">
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-wrap">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day, i) => (
                        <div key={i} className="w-1/2 md:w-1/4 py-1">
                          <input
                            type="checkbox"
                            className="mr-1 rounded-sm"
                            value={day}
                            id={`checkbox${i + 1}`}
                            name="availability"
                            checked={selectedCheckBox[i]}
                            onChange={() => {
                              setSelectedCheckBox((prevState) =>
                                prevState.map((val, index) =>
                                  index === i ? !val : val,
                                ),
                              );
                            }}
                          />
                          <label htmlFor={`checkbox${i + 1}`}>{day}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {formErrors.checkbox && (
                  <p className="text-red-500">{formErrors.checkbox}</p>
                )}
              </div>

              <div className="flex flex-row w-full gap-14">
                <div className="lg:w-1/4 w-full md:mb-6 mb-3">
                  <label className="form-label text-dark-grey">
                    Are you available to work <br></br>on weekends?{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  {/* Radio buttons */}
                  <div className="flex flex-row items-center pt-2 space-x-10">
                    <div className="flex flex-row items-center">
                      <input
                        id="available"
                        name="weekendAvailability"
                        value="Yes"
                        type="radio"
                        className="mr-2"
                        checked={selectedRadioBtn["radioSet2"][0]}
                        onChange={() =>
                          setSelectedRadioBtn({
                            ...selectedRadioBtn,
                            radioSet2: [true, false],
                          })
                        }
                      />
                      <label htmlFor="available"> Yes</label>
                    </div>

                    <div className="flex flex-row items-center">
                      <input
                        id="notAvailable"
                        name="weekendAvailability"
                        value="No"
                        type="radio"
                        className="mr-2"
                        checked={selectedRadioBtn["radioSet2"][1]}
                        onChange={() =>
                          setSelectedRadioBtn({
                            ...selectedRadioBtn,
                            radioSet2: [false, true],
                          })
                        }
                      />
                      <label htmlFor="notAvailable"> No</label>
                    </div>
                  </div>
                  {formErrors.radio2 && (
                    <p className="text-red-500">{formErrors.radio2}</p>
                  )}
                </div>

                <div className="lg:w-1/3 w-full md:mb-6 mb-3">
                  <label
                    htmlFor="overtime"
                    className="form-label text-dark-grey"
                  >
                    Would you be available to work <br></br>overtime, if
                    necessary? <span className="text-red-500">*</span>
                  </label>

                  {/* Radio buttons */}
                  <div className="flex flex-row items-center pt-2 space-x-10">
                    <div className="flex flex-row items-center">
                      <input
                        id="yesOvertime"
                        name="overtime"
                        value="Yes"
                        type="radio"
                        className="mr-2"
                        checked={selectedRadioBtn["radioSet3"][0]}
                        onChange={() =>
                          setSelectedRadioBtn({
                            ...selectedRadioBtn,
                            radioSet3: [true, false],
                          })
                        }
                      />
                      <label htmlFor="overtime"> Yes</label>
                    </div>

                    <div className="flex flex-row items-center">
                      <input
                        id="noOvertime"
                        name="overtime"
                        value="No"
                        type="radio"
                        className="mr-2"
                        checked={selectedRadioBtn["radioSet3"][1]}
                        onChange={() =>
                          setSelectedRadioBtn({
                            ...selectedRadioBtn,
                            radioSet3: [false, true],
                          })
                        }
                      />
                      <label htmlFor="overtime"> No</label>
                    </div>
                  </div>
                  {formErrors.radio3 && (
                    <p className="text-red-500">{formErrors.radio3}</p>
                  )}
                </div>
              </div>

              <div className="w-full md:mb-6 mb-3">
                <label
                  htmlFor="startDate"
                  className="form-label text-dark-grey"
                >
                  If hired, what date can you start work?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 md:w-1/3 lg:w-1/5 w-2/3 h-12 border-mischka"
                  placeholder="mm/dd/yyyy"
                  type="date"
                  required
                />
              </div>

              <div className="w-full md:mb-6 mb-3">
                <label
                  htmlFor="accommodation"
                  className="form-label text-dark-grey"
                >
                  Are you able to perform the essential job functions of the job
                  for which you are applying with or without reasonable
                  accommodation? <span className="text-red-500">*</span>
                </label>

                {/* Radio buttons */}
                <div className="flex flex-row items-center pt-2 space-x-10">
                  <div className="flex flex-row items-center">
                    <input
                      id="yesAccommodation"
                      name="accommodation"
                      value="Yes"
                      type="radio"
                      className="mr-2"
                      checked={selectedRadioBtn["radioSet4"][0]}
                      onChange={() => {
                        setSelectedRadioBtn({
                          ...selectedRadioBtn,
                          radioSet4: [true, false],
                        });
                        setIsRequired(false);
                      }}
                    />
                    <label htmlFor="accommodation"> Yes</label>
                  </div>

                  <div className="flex flex-row items-center">
                    <input
                      id="noAccommodation"
                      name="accommodation"
                      value="No"
                      type="radio"
                      className="mr-2"
                      checked={selectedRadioBtn["radioSet4"][1]}
                      onChange={() => {
                        setSelectedRadioBtn({
                          ...selectedRadioBtn,
                          radioSet4: [false, true],
                        });
                        setIsRequired(true);
                      }}
                    />
                    <label htmlFor="accommodation"> No</label>
                  </div>
                </div>
                {formErrors.radio4 && (
                  <p className="text-red-500">{formErrors.radio4}</p>
                )}
              </div>

              <div className="w-full md:mb-6 mb-3">
                <label
                  htmlFor="accommodationMessage"
                  className="form-label text-dark-grey"
                >
                  If no, describe the functions that cannot be performed.
                  <span
                    className={`text-red-500 ${isRequired ? "inline" : "hidden"}`}
                  >
                    *
                  </span>
                </label>

                <textarea
                  id="accommodationMessage"
                  name="accommodationMessage"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                  placeholder="Note: We comply with the ADA and consider reasonable accommodation measures that may be necessary for qualified applicants/employees to perform essential job functions."
                  rows={7}
                  required={isRequired}
                ></textarea>
              </div>

              {/* EMPLOYMENT EXPERIENCE */}
              <h5 className="text-dark-grey pt-10 w-full">
                EMPLOYMENT EXPERIENCE
              </h5>
              <p>
                List the names of your present or previous employers in
                chronological order with present or most recent employer listed
                first. Be sure to account for all periods of time. If
                self-employed, give firm name and supply business references.
                Add additional page if necessary.
              </p>
              <hr className="w-full h-[1px] bg-dark-grey my-6" />
              <div className="w-full">
                {employmentExperiences.map((experience, index) => (
                  <div key={index} className="flex flex-col mb-6">
                    <div className="flex md:flex-row flex-col">
                      <div className="w-full xl:w-1/4 lg:w-1/2 md:mb-6 mb-3 pr-3">
                        <label
                          htmlFor={`nameofEmployer${index}`}
                          className="form-label text-dark-grey"
                        >
                          Name of Employer{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`nameofEmployer${index}`}
                          name={`nameofEmployer`}
                          className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                          type="text"
                          value={experience.nameofEmployer}
                          onChange={(event) => handleInputChange(index, event)}
                          required
                        />
                      </div>

                      <div className="w-full xl:w-1/4 lg:w-1/2 md:mb-6 mb-3 md:pr-14 pr-3">
                        <label
                          htmlFor={`supervisor${index}`}
                          className="form-label text-dark-grey"
                        >
                          Supervisor <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`supervisor${index}`}
                          name={`supervisor`}
                          className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                          type="text"
                          value={experience.supervisor}
                          onChange={(event) => handleInputChange(index, event)}
                          required
                        />
                      </div>

                      <div className="flex flex-col w-full xl:w-1/4 lg:w-1/2 md:mb-6 mb-3">
                        <label className="form-label text-dark-grey">
                          May we contact?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-row items-center md:space-x-10 space-x-3">
                          <div className="flex flex-row items-center">
                            <input
                              id={`yesEmployerContact${index}`}
                              name={`employerContact${index}`}
                              value="Yes"
                              type="radio"
                              className="mr-1"
                              checked={
                                selectedEmploymentRadioBtn[
                                  `radioSet${index}`
                                ][0]
                              }
                              onChange={(event) => {
                                setSelectedEmploymentRadioBtn({
                                  ...selectedEmploymentRadioBtn,
                                  [`radioSet${index}`]: [true, false],
                                });
                              }}
                            />
                            <label htmlFor={`yesEmployerContact${index}`}>
                              Yes
                            </label>
                          </div>

                          <div className="flex flex-row items-center">
                            <input
                              id={`noEmployerContact${index}`}
                              name={`employerContact${index}`}
                              value="No"
                              type="radio"
                              className="md:ml-4 mr-1"
                              checked={
                                selectedEmploymentRadioBtn[
                                  `radioSet${index}`
                                ][1]
                              }
                              onChange={(event) => {
                                setSelectedEmploymentRadioBtn({
                                  ...selectedEmploymentRadioBtn,
                                  [`radioSet${index}`]: [false, true],
                                });
                              }}
                            />
                            <label htmlFor={`noEmployerContact${index}`}>
                              No
                            </label>
                          </div>
                        </div>

                        {employmentExpFormErrors[`radio${index}`] && (
                          <p className="text-red-500">
                            {employmentExpFormErrors[`radio${index}`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col w-full md:mb-6 mb-3 pr-3">
                      <label
                        htmlFor={`employerAddress${index}`}
                        className="form-label text-dark-grey"
                      >
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`employerAddress${index}`}
                        name={`employerAddress`}
                        className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full xl:w-1/3 md:w-3/5 h-12 border-mischka"
                        type="text"
                        value={experience.employerAddress}
                        onChange={(event) => handleInputChange(index, event)}
                        required
                      />
                    </div>

                    <div className="flex md:flex-row flex-col w-full">
                      <div className="w-full xl:w-1/4 lg:w-1/2 pr-3 md:mb-6 mb-3">
                        <label
                          htmlFor={`employerPhone${index}`}
                          className="form-label text-dark-grey"
                        >
                          Phone number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`employerPhone${index}`}
                          name={`employerPhone${index}`}
                          className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                          type="tel"
                          placeholder="+ 1 (123) 456-7891"
                          onChange={(e) =>
                            setEmploymentPhoneNumber({
                              ...employmentPhoneNumber,
                              [`phone${index}`]: e.target.value,
                            })
                          }
                          required
                        />
                        {employmentExpFormErrors[`phone${index}`] && (
                          <p className="text-red-500">
                            {employmentExpFormErrors[`phone${index}`]}
                          </p>
                        )}
                      </div>

                      <div className="w-full xl:w-1/4 lg:w-1/2 pr-3 md:mb-6 mb-3">
                        <label
                          htmlFor={`dateEmployedFrom${index}`}
                          className="form-label text-dark-grey"
                        >
                          Date Employed - From{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`dateEmployedFrom${index}`}
                          name={`dateEmployedFrom`}
                          className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                          type="date"
                          value={experience.dateEmployedFrom}
                          onChange={(event) => handleInputChange(index, event)}
                          required
                        />
                      </div>

                      <div className="w-full xl:w-1/4 lg:w-1/2 pr-3 md:mb-6 mb-3">
                        <label
                          htmlFor={`dateEmployedTo${index}`}
                          className="form-label text-dark-grey"
                        >
                          Date Employed - To{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`dateEmployedTo${index}`}
                          name={`dateEmployedTo`}
                          className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                          type="date"
                          value={experience.dateEmployedTo}
                          onChange={(event) => handleInputChange(index, event)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full">
                      <div className="w-full xl:w-2/5 lg:w-1/2 md:mb-6 mb-3 pr-3">
                        <label
                          htmlFor={`jobTitleAndDuties${index}`}
                          className="form-label text-dark-grey"
                        >
                          Job Title and Duties{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`jobTitleAndDuties${index}`}
                          name={`jobTitleAndDuties`}
                          className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                          type="text"
                          value={experience.jobTitleAndDuties}
                          onChange={(event) => handleInputChange(index, event)}
                          required
                        />
                      </div>
                      <div className="w-full xl:w-2/5 lg:w-1/2 md:mb-6 mb-3 pr-3">
                        <label
                          htmlFor={`reasonForLeaving${index}`}
                          className="form-label text-dark-grey"
                        >
                          Reason for Leaving{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`reasonForLeaving${index}`}
                          name={`reasonForLeaving`}
                          className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                          type="text"
                          value={experience.reasonForLeaving}
                          onChange={(event) => handleInputChange(index, event)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(index)}
                      className="bg-red-500 rounded-md text-white text-md px-4 py-2 mt-4 w-[170px]"
                    >
                      Delete Experience
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="bg-blue-500 rounded-md text-md text-white px-4 py-2 mt-4 md:mb-6 mb-3"
                  onClick={handleAddExperience}
                >
                  Add new employment experience
                </button>
              </div>

              <div className="w-full md:mb-6 mb-3">
                <label
                  htmlFor="termination"
                  className="form-label text-dark-grey"
                >
                  Have you ever been involuntarily terminated or asked to resign
                  from any job? <span className="text-red-500">*</span>
                </label>

                {/* Radio buttons */}
                <div className="flex flex-row items-center pt-2 space-x-10">
                  <div className="flex flex-row items-center">
                    <input
                      id="yesTermination"
                      name="termination"
                      value="Yes"
                      type="radio"
                      className="mr-2"
                      checked={selectedRadioBtn["radioSet5"][0]}
                      onChange={() => {
                        setSelectedRadioBtn({
                          ...selectedRadioBtn,
                          radioSet5: [true, false],
                        });
                        setIsRequired2(true);
                      }}
                    />
                    <label htmlFor="termination"> Yes</label>
                  </div>

                  <div className="flex flex-row items-center">
                    <input
                      id="noTermination"
                      name="termination"
                      value="No"
                      type="radio"
                      className="mr-2"
                      checked={selectedRadioBtn["radioSet5"][1]}
                      onChange={() => {
                        setSelectedRadioBtn({
                          ...selectedRadioBtn,
                          radioSet5: [false, true],
                        });
                        setIsRequired2(false);
                      }}
                    />
                    <label htmlFor="termination"> No</label>
                  </div>
                </div>
                {formErrors.radio5 && (
                  <p className="text-red-500">{formErrors.radio5}</p>
                )}
              </div>

              <div className="w-full md:mb-6 mb-3">
                <label
                  htmlFor="terminationMessage"
                  className="form-label text-dark-grey"
                >
                  If yes, explain:
                  <span
                    className={`text-red-500 ${isRequired2 ? "inline" : "hidden"}`}
                  >
                    *
                  </span>
                </label>

                <textarea
                  id="terminationMessage"
                  name="terminationMessage"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka md:mb-6 mb-3"
                  rows={7}
                  required={isRequired2}
                ></textarea>

                <label
                  htmlFor="employmentGaps"
                  className="form-label text-dark-grey"
                >
                  Explain any gaps in your employment history:
                </label>
                <textarea
                  id="employmentGaps"
                  name="employmentGaps"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka md:mb-6 mb-3"
                  rows={7}
                ></textarea>

                <label
                  htmlFor="employmentQualifications"
                  className="form-label text-dark-grey"
                >
                  List any other experience, job related skills, additional
                  languages, or other qualifications that you believe should be
                  considered in evaluating your qualifications for employment.
                </label>
                <textarea
                  id="employmentQualifications"
                  name="employmentQualifications"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                  rows={7}
                ></textarea>
              </div>

              {/* EDUCATION */}
              <h5 className="text-dark-grey pt-10 w-full">EDUCATION</h5>
              <p>Describe your educational background below</p>
              <hr className="w-full h-[1px] bg-dark-grey my-6" />

              <h6 className="text-dark-grey w-full">High School</h6>
              <hr className="md:w-1/2 w-3/5 h-[1px] bg-dark-grey my-4" />
              <div>
                <div className="flex md:flex-row flex-col w-full">
                  <div className="w-full xl:w-1/3 lg:w-1/2 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="highschoolName"
                      className="form-label text-dark-grey"
                    >
                      School Name
                    </label>
                    <input
                      id="highschoolName"
                      name="highschoolName"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-1/4 lg:w-2/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="highschoolYear"
                      className="form-label text-dark-grey"
                    >
                      Year Completed
                    </label>
                    <input
                      id="highschoolYear"
                      name="highschoolYear"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full lg:w-1/2 lg:px-30 mb-3 lg:ml-10">
                    <label className="form-label text-dark-grey">
                      Diploma/Degree?
                    </label>
                    {/* Radio buttons, don't need to validate*/}
                    <div className="flex flex-row items-center md:space-x-10 space-x-3">
                      <div className="flex flex-row items-center">
                        <input
                          id="yesHighschoolDegree"
                          name="highschoolDegree"
                          value="Yes"
                          type="radio"
                          className="mr-1"
                          checked={selectedRadioBtn["radioSet6"][0]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet6: [true, false],
                            })
                          }
                        />
                        <label htmlFor="yesHighschoolDegree"> Yes</label>
                      </div>

                      <div className="flex flex-row items-center">
                        <input
                          id="noHighschoolDegree"
                          name="highschoolDegree"
                          value="No"
                          type="radio"
                          className="md:ml-4 mr-1"
                          checked={selectedRadioBtn["radioSet6"][1]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet6: [false, true],
                            })
                          }
                        />
                        <label htmlFor="noHighschoolDegree"> No</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-row flex-col w-full md:mb-6 mb-3 pr-3">
                  <div className="w-full lg:w-1/3 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="highschoolAreaOfStudy"
                      className="form-label text-dark-grey"
                    >
                      Area of Study/Major
                    </label>
                    <input
                      id="highschoolAreaOfStudy"
                      name="highschoolAreaOfStudy"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-4/5 lg:w-4/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="highschoolSpecialization"
                      className="form-label text-dark-grey"
                    >
                      Specialized Training, Skills, or ExtraCurricular
                      Activities
                    </label>
                    <input
                      id="highschoolSpecialization"
                      name="highschoolSpecialization"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <h6 className="text-dark-grey w-full">College/University</h6>
              <hr className="w-1/2 h-[1px] bg-dark-grey my-4" />
              <div>
                <div className="flex md:flex-row flex-col w-full">
                  <div className="w-full xl:w-1/3 lg:w-1/2 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="collegeName"
                      className="form-label text-dark-grey"
                    >
                      School Name
                    </label>
                    <input
                      id="collegeName"
                      name="collegeName"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-1/4 lg:w-2/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="collegeYear"
                      className="form-label text-dark-grey"
                    >
                      Year Completed
                    </label>
                    <input
                      id="collegeYear"
                      name="collegeYear"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full lg:w-1/2 lg:px-30 mb-3 lg:ml-10">
                    <label className="form-label text-dark-grey">
                      Diploma/Degree?
                    </label>
                    {/* Radio buttons, don't need to validate*/}
                    <div className="flex flex-row items-center md:space-x-10 space-x-3">
                      <div className="flex flex-row items-center">
                        <input
                          id="yesCollegeDegree"
                          name="collegeDegree"
                          value="Yes"
                          type="radio"
                          className="mr-1"
                          checked={selectedRadioBtn["radioSet7"][0]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet7: [true, false],
                            })
                          }
                        />
                        <label htmlFor="yesCollegeDegree"> Yes</label>
                      </div>

                      <div className="flex flex-row items-center">
                        <input
                          id="noCollegeDegree"
                          name="collegeDegree"
                          value="No"
                          type="radio"
                          className="md:ml-4 mr-1"
                          checked={selectedRadioBtn["radioSet7"][1]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet7: [false, true],
                            })
                          }
                        />
                        <label htmlFor="noCollegeDegree"> No</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-row flex-col w-full md:mb-6 mb-3 pr-3">
                  <div className="w-full lg:w-1/3 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="collegeAreaOfStudy"
                      className="form-label text-dark-grey"
                    >
                      Area of Study/Major
                    </label>
                    <input
                      id="collegeAreaOfStudy"
                      name="collegeAreaOfStudy"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-4/5 lg:w-4/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="collegeSpecialization"
                      className="form-label text-dark-grey"
                    >
                      Specialized Training, Skills, or ExtraCurricular
                      Activities
                    </label>
                    <input
                      id="collegeSpecialization"
                      name="collegeSpecialization"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <h6 className="text-dark-grey w-full">
                Graduate/Professional School
              </h6>
              <hr className="w-1/2 h-[1px] bg-dark-grey my-4" />
              <div>
                <div className="flex md:flex-row flex-col w-full">
                  <div className="w-full xl:w-1/3 lg:w-1/2 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="graduateSchoolName"
                      className="form-label text-dark-grey"
                    >
                      School Name
                    </label>
                    <input
                      id="graduateSchoolName"
                      name="graduateSchoolName"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-1/4 lg:w-2/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="graduateSchoolYear"
                      className="form-label text-dark-grey"
                    >
                      Year Completed
                    </label>
                    <input
                      id="graduateSchoolYear"
                      name="graduateSchoolYear"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full lg:w-1/2 lg:px-30 mb-3 lg:ml-10">
                    <label className="form-label text-dark-grey">
                      Diploma/Degree?
                    </label>
                    {/* Radio buttons, don't need to validate*/}
                    <div className="flex flex-row items-center md:space-x-10 space-x-3">
                      <div className="flex flex-row items-center">
                        <input
                          id="yesGraduateSchoolDegree"
                          name="graduateSchoolDegree"
                          value="Yes"
                          type="radio"
                          className="mr-1"
                          checked={selectedRadioBtn["radioSet8"][0]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet8: [true, false],
                            })
                          }
                        />
                        <label htmlFor="yesGraduateSchoolDegree"> Yes</label>
                      </div>

                      <div className="flex flex-row items-center">
                        <input
                          id="noGraduateSchoolDegree"
                          name="graduateSchoolDegree"
                          value="No"
                          type="radio"
                          className="md:ml-4 mr-1"
                          checked={selectedRadioBtn["radioSet8"][1]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet8: [false, true],
                            })
                          }
                        />
                        <label htmlFor="noGraduateSchoolDegree"> No</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-row flex-col w-full md:mb-6 mb-3 pr-3">
                  <div className="w-full lg:w-1/3 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="graduateSchoolAreaOfStudy"
                      className="form-label text-dark-grey"
                    >
                      Area of Study/Major
                    </label>
                    <input
                      id="graduateSchoolAreaOfStudy"
                      name="graduateSchoolAreaOfStudy"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-4/5 lg:w-4/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="graduateSchoolSpecialization"
                      className="form-label text-dark-grey"
                    >
                      Specialized Training, Skills, or ExtraCurricular
                      Activities
                    </label>
                    <input
                      id="graduateSchoolSpecialization"
                      name="graduateSchoolSpecialization"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <h6 className="text-dark-grey w-full">Trade School</h6>
              <hr className="w-1/2 h-[1px] bg-dark-grey my-4" />
              <div>
                <div className="flex md:flex-row flex-col w-full">
                  <div className="w-full xl:w-1/3 lg:w-1/2 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="tradeSchoolName"
                      className="form-label text-dark-grey"
                    >
                      School Name
                    </label>
                    <input
                      id="tradeSchoolName"
                      name="tradeSchoolName"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-1/4 lg:w-2/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="tradeSchoolYear"
                      className="form-label text-dark-grey"
                    >
                      Year Completed
                    </label>
                    <input
                      id="tradeSchoolYear"
                      name="tradeSchoolYear"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full lg:w-1/2 lg:px-30 mb-3 lg:ml-10">
                    <label className="form-label text-dark-grey">
                      Diploma/Degree?
                    </label>
                    {/* Radio buttons, don't need to validate*/}
                    <div className="flex flex-row items-center md:space-x-10 space-x-3">
                      <div className="flex flex-row items-center">
                        <input
                          id="yesTradeSchoolDegree"
                          name="tradeSchoolDegree"
                          value="Yes"
                          type="radio"
                          className="mr-1"
                          checked={selectedRadioBtn["radioSet9"][0]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet9: [true, false],
                            })
                          }
                        />
                        <label htmlFor="yesTradeSchoolDegree"> Yes</label>
                      </div>

                      <div className="flex flex-row items-center">
                        <input
                          id="noTradeSchoolDegree"
                          name="tradeSchoolDegree"
                          value="No"
                          type="radio"
                          className="md:ml-4 mr-1"
                          checked={selectedRadioBtn["radioSet9"][1]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet9: [false, true],
                            })
                          }
                        />
                        <label htmlFor="noTradeSchoolDegree"> No</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-row flex-col w-full md:mb-6 mb-3 pr-3">
                  <div className="w-full lg:w-1/3 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="tradeSchoolAreaOfStudy"
                      className="form-label text-dark-grey"
                    >
                      Area of Study/Major
                    </label>
                    <input
                      id="tradeSchoolAreaOfStudy"
                      name="tradeSchoolAreaOfStudy"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-4/5 lg:w-4/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="tradeSchoolSpecialization"
                      className="form-label text-dark-grey"
                    >
                      Specialized Training, Skills, or ExtraCurricular
                      Activities
                    </label>
                    <input
                      id="tradeSchoolSpecialization"
                      name="tradeSchoolSpecialization"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <h6 className="text-dark-grey w-full">Other</h6>
              <hr className="w-1/2 h-[1px] bg-dark-grey my-4" />
              <div>
                <div className="flex md:flex-row flex-col w-full">
                  <div className="w-full xl:w-1/3 lg:w-1/2 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="otherName"
                      className="form-label text-dark-grey"
                    >
                      School Name
                    </label>
                    <input
                      id="otherName"
                      name="otherName"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-1/4 lg:w-2/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="otherYear"
                      className="form-label text-dark-grey"
                    >
                      Year Completed
                    </label>
                    <input
                      id="otherYear"
                      name="otherYear"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full lg:w-1/2 lg:px-30 mb-3 lg:ml-10">
                    <label className="form-label text-dark-grey">
                      Diploma/Degree?
                    </label>
                    {/* Radio buttons, don't need to validate*/}
                    <div className="flex flex-row items-center md:space-x-10 space-x-3">
                      <div className="flex flex-row items-center">
                        <input
                          id="yesOtherDegree"
                          name="otherDegree"
                          value="Yes"
                          type="radio"
                          className="mr-1"
                          checked={selectedRadioBtn["radioSet10"][0]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet10: [true, false],
                            })
                          }
                        />
                        <label htmlFor="yesOtherDegree"> Yes</label>
                      </div>

                      <div className="flex flex-row items-center">
                        <input
                          id="noOtherDegree"
                          name="otherDegree"
                          value="No"
                          type="radio"
                          className="md:ml-4 mr-1"
                          checked={selectedRadioBtn["radioSet10"][1]}
                          onChange={() =>
                            setSelectedRadioBtn({
                              ...selectedRadioBtn,
                              radioSet10: [false, true],
                            })
                          }
                        />
                        <label htmlFor="noOtherDegree"> No</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-row flex-col w-full md:mb-6 mb-3 pr-3">
                  <div className="w-full lg:w-1/3 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="otherAreaOfStudy"
                      className="form-label text-dark-grey"
                    >
                      Area of Study/Major
                    </label>
                    <input
                      id="otherAreaOfStudy"
                      name="otherAreaOfStudy"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>

                  <div className="w-full xl:w-4/5 lg:w-4/5 pr-3 md:mb-6 mb-3">
                    <label
                      htmlFor="otherSpecialization"
                      className="form-label text-dark-grey"
                    >
                      Specialized Training, Skills, or ExtraCurricular
                      Activities
                    </label>
                    <input
                      id="otherSpecialization"
                      name="otherSpecialization"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full border-mischka"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h5 className="text-dark-grey pt-10 w-full">
              BUSINESS AND PROFESSIONAL REFERENCES
            </h5>
            <p>
              List three professional references of individuals who are not
              related to you:
            </p>
            <hr className="w-full h-[1px] bg-dark-grey my-6" />
            <div className="flex md:flex-row flex-col">
              <div className="flex flex-col w-full xl:w-1/4 lg:w-1/2 md:pr-3 mb-6">
                <label
                  htmlFor="businessReferenceNameAndTitle1"
                  className="form-label text-dark-grey"
                >
                  Name and Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessReferenceNameAndTitle1"
                  name="businessReferenceNameAndTitle1"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  type="text"
                  required
                />

                <div className="md:mt-6 mt-3">
                  <input
                    id="businessReferenceNameAndTitle2"
                    name="businessReferenceNameAndTitle2"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>

                <div className="md:mt-6 mt-3">
                  <input
                    id="businessReferenceNameAndTitle3"
                    name="businessReferenceNameAndTitle3"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full xl:w-1/4 lg:w-1/2 md:pr-3 mb-6">
                <label
                  htmlFor="businessReferenceRelationship1"
                  className="form-label text-dark-grey"
                >
                  Relationship <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessReferenceRelationship1"
                  name="businessReferenceRelationship1"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  type="text"
                  required
                />
                <div className="md:mt-6 mt-3">
                  <input
                    id="businessReferenceRelationship2"
                    name="businessReferenceRelationship2"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>

                <div className="md:mt-6 mt-3">
                  <input
                    id="businessReferenceRelationship3"
                    name="businessReferenceRelationship3"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full xl:w-1/4 lg:w-1/2 mb-6">
                <label
                  htmlFor="businessReferencePhoneOrEmail1"
                  className="form-label text-dark-grey"
                >
                  Phone Number or Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessReferencePhoneOrEmail1"
                  name="businessReferencePhoneOrEmail1"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  type="text"
                  required
                />

                <div className="md:mt-6 mt-3">
                  <input
                    id="businessReferencePhoneOrEmail2"
                    name="businessReferencePhoneOrEmail2"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>

                <div className="md:mt-6 mt-3">
                  <input
                    id="businessReferencePhoneOrEmail3"
                    name="businessReferencePhoneOrEmail3"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <h5 className="text-dark-grey pt-10 w-full">PERSONAL REFERENCES</h5>
            <p>List three people who know you well:</p>
            <hr className="w-full h-[1px] bg-dark-grey my-6" />
            <div className="flex md:flex-row flex-col">
              <div className="flex flex-col w-full xl:w-1/4 lg:w-1/2 md:pr-3 mb-6">
                <label
                  htmlFor="personalReferenceNameAndTitle1"
                  className="form-label text-dark-grey"
                >
                  <br />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="personalReferenceNameAndTitle1"
                  name="personalReferenceNameAndTitle1"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  type="text"
                  required
                />
                <div className="md:mt-6 mt-3">
                  <input
                    id="personalReferenceNameAndTitle2"
                    name="personalReferenceNameAndTitle2"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>

                <div className="md:mt-6 mt-3">
                  <input
                    id="personalReferenceNameAndTitle3"
                    name="personalReferenceNameAndTitle3"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full xl:w-1/4 lg:w-1/2 md:pr-3 mb-6">
                <label
                  htmlFor="personalReferenceRelationship1"
                  className="form-label text-dark-grey"
                >
                  Relationship and Years Acquainted{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="personalReferenceRelationship1"
                  name="personalReferenceRelationship1"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  type="text"
                  required
                />
                <div className="md:mt-6 mt-3">
                  <input
                    id="personalReferenceRelationship2"
                    name="personalReferenceRelationship2"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>
                <div className="md:mt-6 mt-3">
                  <input
                    id="personalReferenceRelationship3"
                    name="personalReferenceRelationship3"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full xl:w-1/4 lg:w-1/2 mb-6">
                <label
                  htmlFor="personalReferencePhoneOrEmail1"
                  className="form-label text-dark-grey"
                >
                  Phone Number or <br />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="personalReferencePhoneOrEmail1"
                  name="personalReferencePhoneOrEmail1"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  type="text"
                  required
                />
                <div className="md:mt-6 mt-3">
                  <input
                    id="personalReferencePhoneOrEmail2"
                    name="personalReferencePhoneOrEmail2"
                    className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                    type="text"
                  />
                  <div className="md:mt-6 mt-3">
                    <input
                      id="personalReferencePhoneOrEmail3"
                      name="personalReferencePhoneOrEmail3"
                      className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h5 className="text-dark-grey pt-10 w-full">GENERAL INFORMATION</h5>
            <hr className="w-full h-[1px] bg-dark-grey my-6" />
            <div className="w-full md:mb-6 mb-3">
              <label
                htmlFor="transportation"
                className="form-label text-dark-grey"
              >
                If hired, would you have a reliable means of transportation to
                and from work? <span className="text-red-500">*</span>
              </label>

              {/* Radio buttons */}
              <div className="flex flex-row items-center pt-2 space-x-10">
                <div className="flex flex-row items-center">
                  <input
                    id="yesTransportation "
                    name="transportation"
                    value="Yes"
                    type="radio"
                    className="mr-2"
                    checked={selectedRadioBtn["radioSet11"][0]}
                    onChange={() => {
                      setSelectedRadioBtn({
                        ...selectedRadioBtn,
                        radioSet11: [true, false],
                      });
                    }}
                  />
                  <label htmlFor="transportation"> Yes</label>
                </div>

                <div className="flex flex-row items-center">
                  <input
                    id="noTransportation"
                    name="transportation"
                    value="No"
                    type="radio"
                    className="mr-2"
                    checked={selectedRadioBtn["radioSet11"][1]}
                    onChange={() => {
                      setSelectedRadioBtn({
                        ...selectedRadioBtn,
                        radioSet11: [false, true],
                      });
                    }}
                  />
                  <label htmlFor="transportation"> No</label>
                </div>
              </div>
              {formErrors.radio11 && (
                <p className="text-red-500">{formErrors.radio11}</p>
              )}
            </div>
            <div className="w-full md:mb-6 mb-3">
              <label
                htmlFor="ageRequirement"
                className="form-label text-dark-grey"
              >
                Are you at least 18 years old?{" "}
                <span className="text-red-500">*</span>
              </label>

              {/* Radio buttons */}
              <div className="flex flex-row items-center pt-2 space-x-10">
                <div className="flex flex-row items-center">
                  <input
                    id="yesAgeRequirement"
                    name="ageRequirement"
                    value="Yes"
                    type="radio"
                    className="mr-2"
                    checked={selectedRadioBtn["radioSet12"][0]}
                    onChange={() => {
                      setSelectedRadioBtn({
                        ...selectedRadioBtn,
                        radioSet12: [true, false],
                      });
                    }}
                  />
                  <label htmlFor="ageRequirement"> Yes</label>
                </div>

                <div className="flex flex-row items-center">
                  <input
                    id="noAgeRequirement"
                    name="ageRequirement"
                    value="No"
                    type="radio"
                    className="mr-2"
                    checked={selectedRadioBtn["radioSet12"][1]}
                    onChange={() => {
                      setSelectedRadioBtn({
                        ...selectedRadioBtn,
                        radioSet12: [false, true],
                      });
                    }}
                  />
                  <label htmlFor="ageRequirement"> No</label>
                </div>
              </div>
              <p className="pt-2">
                Note: If under 18, hire is subject to verification that you are
                of minimum legal age
              </p>
              {formErrors.radio12 && (
                <p className="text-red-500">{formErrors.radio12}</p>
              )}
            </div>
            <div className="w-full md:mb-6 mb-3">
              <label
                htmlFor="employmentAuthorization"
                className="form-label text-dark-grey"
              >
                If hired, can you present evidence of your identity and legal
                right to work in this country?{" "}
                <span className="text-red-500">*</span>
              </label>

              {/* Radio buttons */}
              <div className="flex flex-row items-center pt-2 space-x-10">
                <div className="flex flex-row items-center">
                  <input
                    id="yesEmploymentAuthorization"
                    name="employmentAuthorization"
                    value="Yes"
                    type="radio"
                    className="mr-2"
                    checked={selectedRadioBtn["radioSet13"][0]}
                    onChange={() => {
                      setSelectedRadioBtn({
                        ...selectedRadioBtn,
                        radioSet13: [true, false],
                      });
                    }}
                  />
                  <label htmlFor="employmentAuthorization"> Yes</label>
                </div>

                <div className="flex flex-row items-center">
                  <input
                    id="noEmploymentAuthorization"
                    name="employmentAuthorization"
                    value="No"
                    type="radio"
                    className="mr-2"
                    checked={selectedRadioBtn["radioSet13"][1]}
                    onChange={() => {
                      setSelectedRadioBtn({
                        ...selectedRadioBtn,
                        radioSet13: [false, true],
                      });
                    }}
                  />
                  <label htmlFor="employmentAuthorization"> No</label>
                </div>
              </div>
              {formErrors.radio13 && (
                <p className="text-red-500">{formErrors.radio13}</p>
              )}
            </div>

            {/* APPLICANT STATEMENT AND AGREEMENT */}
            <h5 className="text-dark-grey pt-10 w-full">
              APPLICANT STATEMENT AND AGREEMENT
            </h5>
            <p>
              Read and initial each paragraph below. Then, select the check
              mark. If there is anything that you do not understand, please ask.
            </p>
            <hr className="w-full h-[1px] bg-dark-grey my-6" />
            <div className="flex flex-col w-full">
              <div className="w-full lg:w-1/4 pr-3 md:mb-6 mb-3 mt-4 flex">
                <input
                  id="initialHere1"
                  name="initialHere1"
                  className="form-input rounded-none bg-white placeholder-gray-400 w-full h-12 border-mischka border-x-0 border-t-0"
                  type="text"
                  placeholder="Initial here..."
                  required
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="w-full py-1">
                <input
                  type="checkbox"
                  className="mr-2 rounded-sm"
                  id="initialHereCheckbox1"
                  name="statementAndAgreement1"
                  checked={selectedCheckBox2[0]}
                  value="Yes"
                  onChange={() => {
                    setSelectedCheckBox2((prevState) =>
                      prevState.map((val, index) => (index === 0 ? !val : val)),
                    );
                  }}
                  required
                />
                <label htmlFor="initialHereCheckbox1">
                  I hereby authorize Ninth Ave. Foods to thoroughly investigate
                  my references, work record, education and other matters
                  related to my suitability for employment and, further,
                  authorize the prior employers and references I have listed to
                  disclose to Ninth Ave. Foods all letters, reports and other
                  information related to my work records, without giving me
                  prior notice of such disclosure. In addition, I hereby release
                  Ninth Ave. Foods, my former employers and all other persons,
                  corporations, partnerships and associations from any and all
                  claims, demands, or liabilities arising out of or in any way
                  related to such investigation or disclosure.
                </label>
              </div>

              <div className="w-full lg:w-1/4 pr-3 md:mb-6 mb-3 mt-4 flex">
                <input
                  id="initialHere2"
                  name="initialHere2"
                  className="form-input rounded-none bg-white placeholder-gray-400 w-full h-12 border-mischka border-x-0 border-t-0"
                  type="text"
                  placeholder="Initial here..."
                  required
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="w-full py-1">
                <input
                  type="checkbox"
                  className="mr-2 rounded-sm"
                  id="initialHereCheckbox2"
                  name="statementAndAgreement2"
                  checked={selectedCheckBox2[1]}
                  value="Yes"
                  onChange={() => {
                    setSelectedCheckBox2((prevState) =>
                      prevState.map((val, index) => (index === 1 ? !val : val)),
                    );
                  }}
                  required
                />
                <label htmlFor="initialHereCheckbox2">
                  If I am employed by Ninth Ave. Foods, I understand that I am
                  required to comply with all rules and regulations of the Ninth
                  Ave. Foods
                </label>
              </div>

              <div className="w-full lg:w-1/4 pr-3 md:mb-6 mb-3 mt-4 flex">
                <input
                  id="initialHere3"
                  name="initialHere3"
                  className="form-input rounded-none bg-white placeholder-gray-400 w-full h-12 border-mischka border-x-0 border-t-0"
                  type="text"
                  placeholder="Initial here..."
                  required
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="w-full py-1">
                <input
                  type="checkbox"
                  className="mr-2 rounded-sm"
                  id="initialHereCheckbox3"
                  name="statementAndAgreement3"
                  checked={selectedCheckBox2[2]}
                  value="Yes"
                  onChange={() => {
                    setSelectedCheckBox2((prevState) =>
                      prevState.map((val, index) => (index === 2 ? !val : val)),
                    );
                  }}
                  required
                />
                <label htmlFor="initialHereCheckbox3">
                  If hired, I understand and agree that my employment with Ninth
                  Ave. Foods is at-will, and that neither I, nor the Ninth Ave.
                  Foods is required to continue the employment relationship for
                  any specific term. I further understand that the Ninth Ave.
                  Foods or I may terminate the employment relationship at any
                  time, with or without cause, and with or without notice. I
                  understand that the at-will status of my employment cannot be
                  amended, modified, or altered in any way by any oral
                  modifications.
                </label>
              </div>

              <div className="w-full lg:w-1/4 pr-3 md:mb-6 mb-3 mt-4 flex">
                <input
                  id="initialHere4"
                  name="initialHere4"
                  className="form-input rounded-none bg-white placeholder-gray-400 w-full h-12 border-mischka border-x-0 border-t-0"
                  type="text"
                  placeholder="Initial here..."
                  required
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="w-full py-1">
                <input
                  type="checkbox"
                  className="mr-2 rounded-sm"
                  id="initialHereCheckbox4"
                  name="statementAndAgreement4"
                  checked={selectedCheckBox2[3]}
                  value="Yes"
                  onChange={() => {
                    setSelectedCheckBox2((prevState) =>
                      prevState.map((val, index) => (index === 3 ? !val : val)),
                    );
                  }}
                  required
                />
                <label htmlFor="initialHereCheckbox4">
                  I hereby certify that the answers given by me are true and
                  correct to the best of my knowledge. I further certify that I,
                  the undersigned applicant, have personally completed this
                  application. I understand that any omission or misstatement of
                  material fact on this application or on any document used to
                  secure employment shall be grounds for rejection of this
                  application or for immediate discharge if I am employed,
                  regardless of the time elapsed before discovery.
                </label>
              </div>

              <div className="w-full lg:w-1/4 pr-3 md:mb-6 mb-3 mt-4 flex">
                <input
                  id="initialHere5"
                  name="initialHere5"
                  className="form-input rounded-none bg-white placeholder-gray-400 w-full h-12 border-mischka border-x-0 border-t-0"
                  type="text"
                  placeholder="Initial here..."
                  required
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="w-full py-1">
                <input
                  type="checkbox"
                  className="mr-2 rounded-sm"
                  id="initialHereCheckbox5"
                  name="statementAndAgreement5"
                  checked={selectedCheckBox2[4]}
                  value="Yes"
                  onChange={() => {
                    setSelectedCheckBox2((prevState) =>
                      prevState.map((val, index) => (index === 4 ? !val : val)),
                    );
                  }}
                  required
                />
                <label htmlFor="initialHereCheckbox5">
                  I understand that if I am selected for hire, it will be
                  necessary for me to provide satisfactory evidence of my
                  identity and legal authority to work in the United States, and
                  that federal immigration laws require me to complete an I-9
                  Form in this regard.
                </label>
              </div>

              <div className="w-full lg:w-1/4 pr-3 md:mb-6 mb-3 mt-4 flex">
                <input
                  id="initialHere6"
                  name="initialHere6"
                  className="form-input rounded-none bg-white placeholder-gray-400 w-full h-12 border-mischka border-x-0 border-t-0"
                  type="text"
                  placeholder="Initial here..."
                  required
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="w-full py-1">
                <input
                  type="checkbox"
                  className="mr-2 rounded-sm"
                  id="initialHereCheckbox6"
                  name="statementAndAgreement6"
                  checked={selectedCheckBox2[5]}
                  value="Yes"
                  onChange={() => {
                    setSelectedCheckBox2((prevState) =>
                      prevState.map((val, index) => (index === 5 ? !val : val)),
                    );
                  }}
                  required
                />
                <label htmlFor="initialHereCheckbox6">
                  I understand that if any term, provision, or portion of this
                  Agreement is declared void or unenforceable, it shall be
                  severed and the remainder of this Agreement shall be
                  enforceable.
                </label>
              </div>
            </div>

            {/* Electronic Signature */}
            <h5 className="text-dark-grey pt-10 w-full">
              MY SIGNATURE INDICATES THAT I HAVE READ, UNDERSTAND, AND AGREED TO
              ALL OF THE ABOVE TERMS
            </h5>
            <hr className="w-full h-[1px] bg-dark-grey my-6" />
            <div className="flex md:flex-row flex-col w-full">
              <div className="w-full xl:w-1/2 lg:w-1/2 pr-3 md:mb-6 mb-3">
                <label htmlFor="fname" className="form-label text-dark-grey">
                  Sign Your Full Name (Electronic Signature):{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="electronicSignature"
                  name="electronicSignature"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  type="text"
                  required
                />
              </div>

              <div className="w-full xl:w-1/4 lg:w-1/2 pr-3 md:mb-6 mb-3">
                <label
                  htmlFor="todaysDate"
                  className="form-label text-dark-grey"
                >
                  Today&apos;s Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="todaysDate"
                  name="todaysDate"
                  className="form-input bg-light-grey shadow-sm placeholder-gray-400 w-full h-12 border-mischka"
                  placeholder="mm/dd/yyyy"
                  type="date"
                  required
                />
              </div>
            </div>

            {/* Submit form button */}
            <div className="pt-10">
              <button
                type="submit"
                className="bg-primary hover:bg-dark-grey text-white font-semibold py-2 px-6 border border-primary hover:border-transparent rounded"
                disabled={isLoading}
              >
                <svg
                  aria-hidden="true"
                  className={`${isLoading ? "inline w-6 h-6 text-gray-200 animate-spin fill-blue-600 mr-2" : "hidden"}`}
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-5 pt-10">
          {!isFormValid && error && !isLoading && (
            <ErrorAlert error_message={error}></ErrorAlert>
          )}
        </div>
      </section>
    </>
  );
};

export default EmployeeApplicationForm;
