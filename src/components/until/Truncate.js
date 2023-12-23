function Truncate(propString) {
  function truncate(str) {
    return str && str.length > propString.maxlength
      ? str.substring(0, propString.maxlength - 3) + "..."
      : str;
  }

  return <span>{truncate(propString.str)}</span>;
}

export default Truncate;
