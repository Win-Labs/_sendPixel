interface TargetImageProps {
  nounImageId: "string";
}

const TargetImage = (props: TargetImageProps) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 pb-4 pt-4  bg-black text-yellow-500 border-4 border-yellow-500">
      <span>Recommended Image</span>
      <img src={`https://noun.pics/${props.nounImageId}`} />
    </div>
  );
};

export default TargetImage;
