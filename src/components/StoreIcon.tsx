type StoreIconProps = {
  store: "apple" | "playstore" | "web";
  className?: string;
};

export default function StoreIcon({ store, className = "" }: StoreIconProps) {
  return (
    <span
      className={`store-icon store-icon--${store} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
