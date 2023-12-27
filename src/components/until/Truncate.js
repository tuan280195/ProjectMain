function Truncate(propString) {
  function truncate(str) {
    return str && str.length > propString.maxlength
      ? str.substring(0, propString.maxlength - 3) + "..."
      : str;
  }

  return <span style={propString.style}>{truncate(propString.str)}</span>;
}

export default Truncate;
