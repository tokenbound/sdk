import React from "react";

const ArgInput = ({ ...props }) => {
  return (
    <div>
      <div className="mt-2 flex rounded-md shadow-sm">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 sm:text-sm w-1/4">
          {props.arg}
        </span>
        <input
          type="text"
          name={props.arg}
          onChange={props.onChange}
          value={props.value}
          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={props.argType}
        />
      </div>
    </div>
  );
};

export default ArgInput;
