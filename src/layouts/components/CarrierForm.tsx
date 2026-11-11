"use client";

import { FormEvent, useState } from "react";
import ErrorAlert from "@/partials/ErrorAlert";
import SuccessMessage from "@/partials/SubmissionMessage";
import { Turnstile } from "@marsidev/react-turnstile";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

const CarrierForm = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);

      // if (!turnstileToken) {
      //   throw new Error("Please wait for verification to complete.");
      // }

      // formData.set("cf-turnstile-response", turnstileToken);

      const response = await fetch("/api/carrier-form", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Unable to submit the form. Please try again.",
        );
      } else {
        setFormSubmitted(true); // Show the overlay after success
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message); // Capture the error message to display to the user
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade ease-in mx-auto p-6 md:col-7 mb-20 md:mb-0">
      {isFormSubmitted && (
        <SuccessMessage
          title="Thank you for submitting"
          return_to_link="/carrier-inquiries"
          image="/images/send-mail.png"
          message="Your form submission has been received."
          submessage="We will be in touch with you shortly."
        />
      )}

      <form method="POST" onSubmit={onSubmit}>
        <div className="flex flex-wrap md:-mx-6 mx-8">
          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="entityType"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              Entity Type <span className="text-red-500">*</span>
            </label>
            <input
              id="entityType"
              name="entityType"
              className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
              placeholder="	e.g. Carrier or Broker"
              type="text"
              required
            />
          </div>

          <div className="flex w-full flex-row gap-8 pb-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="operatingStatus"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                Operating Status <span className="text-red-500">*</span>
              </label>
              <input
                id="operatingStatus"
                name="operatingStatus"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="e.g. Active"
                type="text"
                required
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="outOfServiceDate"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                Out of Service Date <span className="text-red-500">*</span>
              </label>
              <input
                id="outOfServiceDate"
                name="outOfServiceDate"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="Out of Service Date"
                type="date"
                required
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="legalName"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              id="legalName"
              name="legalName"
              className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
              placeholder="e.g. Acme Transport LLC"
              type="text"
              required
            />
          </div>

          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="dbaName"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              DBA Name <span className="text-red-500">*</span>
            </label>
            <input
              id="dbaName"
              name="dbaName"
              className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
              placeholder="e.g. Acme Freight"
              type="text"
              required
            />
          </div>

          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="physicalAddress"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              Physical Address <span className="text-red-500">*</span>
            </label>
            <input
              id="physicalAddress"
              name="physicalAddress"
              className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
              placeholder="Street address, city, state, ZIP"
              type="text"
              required
            />
          </div>

          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="phone"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
              placeholder="(555) 010-0123"
              type="text"
              required
            />
          </div>

          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="mailingAddress"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              Mailing Address <span className="text-red-500">*</span>
            </label>
            <input
              id="mailingAddress"
              name="mailingAddress"
              className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
              placeholder="Street address or PO Box, city, state, ZIP"
              type="text"
              required
            />
          </div>

          <div className="flex w-full flex-row gap-8 pb-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="usdotNumber"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                USDOT Number <span className="text-red-500">*</span>
              </label>
              <input
                id="usdotNumber"
                name="usdotNumber"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="USDOT Number"
                type="text"
                required
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="stateCarrierId"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                State Carrier ID Number <span className="text-red-500">*</span>
              </label>
              <input
                id="stateCarrierId"
                name="stateCarrierId"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="State Carrier ID Number"
                type="text"
                required
              />
            </div>
          </div>

          <div className="flex w-full flex-row gap-8 pb-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="authorityIds"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                MC/MX/FF Number(s) <span className="text-red-500">*</span>
              </label>
              <input
                id="authorityIds"
                name="authorityIds"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="MC/MX/FF Number(s)"
                type="text"
                required
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="dunsNumber"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                DUNS Number <span className="text-red-500">*</span>
              </label>
              <input
                id="dunsNumber"
                name="dunsNumber"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="DUNS Number"
                type="text"
                required
              />
            </div>
          </div>

          <div className="flex w-full flex-row gap-8 pb-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="powerUnits"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                Power Units <span className="text-red-500">*</span>
              </label>
              <input
                id="powerUnits"
                name="powerUnits"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="Power Units"
                type="text"
                required
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="drivers"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                Drivers <span className="text-red-500">*</span>
              </label>
              <input
                id="drivers"
                name="drivers"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="Drivers"
                type="text"
                required
              />
            </div>
          </div>

          <div className="flex w-full flex-row gap-8 pb-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="mcs150Date"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                MCS-150 Form Date <span className="text-red-500">*</span>
              </label>
              <input
                id="mcs150Date"
                name="mcs150Date"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="MCS-150 Form Date"
                type="date"
                required
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <label
                htmlFor="mcs150Mileage"
                className="form-label text-dark-grey"
                style={{ marginBottom: 2 }}
              >
                MCS-150 Mileage (Year) <span className="text-red-500">*</span>
              </label>
              <input
                id="mcs150Mileage"
                name="mcs150Mileage"
                className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                placeholder="MCS-150 Mileage (Year)"
                type="text"
                required
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="operationClass"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              Operation Classification <span className="text-red-500">*</span>
            </label>
            <input
              id="operationClass"
              name="operationClass"
              className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
              placeholder="Operation Classification"
              type="text"
              required
            />
          </div>

          <div className="flex-row">
            <label
              htmlFor="mainContact"
              className="form-label text-dark-grey pb-1"
              style={{ marginBottom: 1 }}
            >
              Main Contact
            </label>

            <div className="flex w-full flex-row gap-8 pb-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label
                  htmlFor="mainContactName"
                  className="form-label text-dark-grey"
                  style={{ marginBottom: 2 }}
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="mainContactName"
                  name="mainContactName"
                  className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                  placeholder="Full name"
                  type="text"
                  required
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label
                  htmlFor="mainContactEmail"
                  className="form-label text-dark-grey"
                  style={{ marginBottom: 2 }}
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="mainContactEmail"
                  name="mainContactEmail"
                  className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                  placeholder="john.doe@email.com"
                  type="email"
                  required
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label
                  htmlFor="mainContactPhone"
                  className="form-label text-dark-grey"
                  style={{ marginBottom: 2 }}
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="mainContactPhone"
                  name="mainContactPhone"
                  className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                  placeholder="(555) 010-0124"
                  type="text"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex-row">
            <label
              htmlFor="afterHrsContact"
              className="form-label text-dark-grey pb-1"
              style={{ marginBottom: 1 }}
            >
              After Hours Contact
            </label>

            <div className="flex w-full flex-row gap-8 pb-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label
                  htmlFor="afterHrsName"
                  className="form-label text-dark-grey"
                  style={{ marginBottom: 2 }}
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="afterHrsName"
                  name="afterHrsName"
                  className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                  placeholder="Full name"
                  type="text"
                  required
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label
                  htmlFor="afterHrsEmail"
                  className="form-label text-dark-grey"
                  style={{ marginBottom: 2 }}
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="afterHrsEmail"
                  name="afterHrsEmail"
                  className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                  placeholder="john.doe@email.com"
                  type="email"
                  required
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label
                  htmlFor="afterHrsPhone"
                  className="form-label text-dark-grey"
                  style={{ marginBottom: 2 }}
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="afterHrsPhone"
                  name="afterHrsPhone"
                  className="w-full form-input bg-light-grey shadow-sm placeholder-gray-400 h-10 border-mischka"
                  placeholder="(555) 010-0124"
                  type="text"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 pb-4">
            <label
              htmlFor="atcmCompliance"
              className="form-label text-dark-grey"
              style={{ marginBottom: 2 }}
            >
              TRU ATCM Compliance <span className="text-red-500">*</span>
            </label>
            <p className="text-dark-grey" style={{ marginBottom: 2 }}>
              Please attach any other certificates or forms needing completion
            </p>

            <FilePond
              name="files"
              allowMultiple
              storeAsFile
              required
              labelIdle='Drag files here or <span class="filepond--label-action">Browse</span>'
            />
          </div>

          <div className="px-1">
            {/* <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              options={{
                action: "contact",
                appearance: "always",
                theme: "light",
                refreshExpired: "auto",
                refreshTimeout: "auto",
                retry: "auto",
              }}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setError(null);
              }}
              onExpire={() => setTurnstileToken(null)}
              onError={(errorCode) => {
                console.error("Turnstile error:", errorCode);

                setTurnstileToken(null);
                setError(
                  "Verification failed. Please refresh the page and try again.",
                );
              }}
            /> */}
            <button
              type="submit"
              className="btn btn-primary hover:bg-dark-grey hover:border-dark-grey shadow-sm w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:border-primary"
              // disabled={isLoading || !turnstileToken}
            >
              <svg
                aria-hidden="true"
                className={`${
                  isLoading
                    ? "inline w-6 h-6 text-gray-200 animate-spin fill-blue-600 mr-2"
                    : "hidden"
                }`}
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

              {isLoading ? "Loading..." : "Send message"}
            </button>
          </div>
        </div>
      </form>

      <div className="pt-10">
        {error && <ErrorAlert error_message={error} />}
      </div>
    </div>
  );
};

export default CarrierForm;
