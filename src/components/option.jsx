/* eslint-disable react/prop-types */
export default function Option({title, style, click, active, children}){
    return (
        <div 
            onClick={click} 
            className={`flex items-center text-center w-full group rounded-lg p-1 px-2 hover:bg-black/[15%] border-[#FE426A]
            cursor-pointer duration-300 ${active && 'active'}`}
        >
            <div className={`flex items-center gap-3`}>
                {children}
                <p className={`${style} duration-300 text-[.9rem] group-hover:text-[#FE426A]`}>{title}</p>
            </div>
        </div>
    )
}