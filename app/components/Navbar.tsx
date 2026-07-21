
import {Menu, Search} from "lucide-react";
const Navbar =() => {
    return(
        <div className="flex items-center justify-between ">
            {/* logo */}
            <div className="flex space-x-10">
                <div>
                   <Menu size={20} /> 
                </div>
                <div>
                    <h1>StudioOS</h1>
                </div>
            </div>

            <div className="absolute">
                <Search size={20} className="relative top-5"/>
                <input type="text" placeholder="Music, producer,artist..." />
                
            </div>

            <div>
                <div>
                    account
                </div>
            </div>

        </div>
    )
}

export default Navbar;