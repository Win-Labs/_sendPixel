const Loader = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-transparent flex justify-center items-center gap-5 z-50">
      <div className="animate-spinCustom border-[5px] rounded-[50%] border-solid border-blue-400 border-t-blue-800 w-[50px] h-[50px]" />
    </div>
  );
};

export default Loader;
