import Navbar from "./Navbar"
import ListCard from "./ListCard"

export default function ListsPage() {

    return(
        <div className="lists-page">
            <Navbar />
            <h1 className="lists-page-person-header">LISTS BY DIYAR</h1>
            <ListCard />
            <ListCard />
            <ListCard />
            <ListCard />
            <ListCard />
    
        </div>
    )
    
}