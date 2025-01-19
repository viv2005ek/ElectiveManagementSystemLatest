import MainLayout from "../layouts/MainLayout.tsx";
import { useNavigate } from 'react-router-dom';
import img from "../assets/back.png"

export default function ElectiveManagementSystem() {
    {/* route /ems */}
    const navigate = useNavigate();
    const handleClick = ()=>{
        navigate('/oe');
    }
    return (
        <MainLayout>
            <div className={"py-0 px-0"}
            style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover", 
                backgroundPosition: "center", 
            }}
            >
                <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
                    <div className="w-[490px] max-w-full bg-white/20  backdrop-blur-lg rounded-lg shadow-lg border-2 border-orange-300">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-center">Elective Management System</h1>
                        </div>
                        <div className="h-[1px] bg-orange-300"></div>
                        <div className="p-6 space-y-4">
                            <button
                                className="w-full bg-white rounded-lg shadow p-4 text-center font-medium hover:bg-orange-200 transition"
                                onClick={handleClick}
                            >
                                Select an Open Elective
                            </button>
                            <button
                                className="w-full bg-white rounded-lg shadow p-4 text-center font-medium hover:bg-orange-200 transition"
                                onClick={() => console.log("hi")}
                            >
                                Manage Elective
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}