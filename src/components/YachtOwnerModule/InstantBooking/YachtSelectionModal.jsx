    import React from "react";
    import { Modal } from "react-responsive-modal";
    import "react-responsive-modal/styles.css";
    // import sampleYachts from "../data/sampleYachts";
    // import "../styles/YachtSelectionStyles.css";
    import "./YachtSelectionModalStyles.css";
import { getOwnerYachts } from "../../../Redux/yachtReducer/action";
import { useDispatch, useSelector } from "react-redux";
    const sampleYachts = [
        {
        id: 1,
        name: "Luxury Yacht 1",
        description: "A premium yacht with world-class amenities and luxury interiors.",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGx1eHVyeSUyMHlhY2h0fGVufDB8fHx8MTY5MDgyODUxOQ&ixlib=rb-1.2.1&q=80&w=400",
        },
        {
        id: 2,
        name: "Premium Yacht 2",
        description: "Experience unmatched comfort and style on this elegant yacht.",
        image:
            "https://images.unsplash.com/photo-1560011683-4e2c986b0a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fHlhY2h0fGVufDB8fHx8MTY5MDgyODg1Nw&ixlib=rb-1.2.1&q=80&w=400",
        },
        {
        id: 3,
        name: "Elite Yacht 3",
        description: "An elite-class yacht for the ultimate experience at sea.",
        image:
            "https://images.unsplash.com/photo-1516975087501-7b6d3c3d8f02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fHlhY2h0fGVufDB8fHx8MTY5MDgyODkxMw&ixlib=rb-1.2.1&q=80&w=400",
        },
    ];
    const YachtSelectionModal = ({ onSelect, onClose }) => {

        const OwnerYachts = useSelector((store) => store.yachtReducer.OwnerYachts);
        const dispatch =useDispatch()

          useEffect(()=>{
               dispatch(getOwnerYachts)
              },[ ])
    return (
        <Modal open onClose={onClose} center>
        <div className="modal-wrapper">
            <h2>Select a Yacht</h2>
            <div className="yacht-list">
            {OwnerYachts.map((yacht) => (
                <div
                key={yacht.id}
                className="yacht-card"
                onClick={() => onSelect(yacht)}
                >
                <img src={yacht.image} alt={yacht.title} />
                <div className="yacht-details">
                    <h4>{yacht.title}</h4>
                    <p>{yacht.short_description}</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </Modal>
    );
    };

    export default YachtSelectionModal;
