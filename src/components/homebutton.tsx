export function HomeButton() {
  return (
    <button
      className="flex-none bg-blue-700 text-base font-semibold p-2 px-8 rounded-xl
      disabled:bg-blue-300/30 disabled:cursor-default disabled:text-gray-400
      hover:bg-blue-500 active:bg-blue-500 transition-all duration-100 cursor-pointer"
      onClick={() => {location.href='/';}}
      >Home</button>
  )
}