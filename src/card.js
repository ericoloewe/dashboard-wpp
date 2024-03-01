import { useNavigate } from "react-router-dom";

export function Card({ group }) {
  const navigate = useNavigate();

  function goToGroup() {
    navigate('/group-details', { state: group });
  }

  return (
    <button onClick={goToGroup} className="card">
      <img src={group.profilePicture} alt={group.name} />
      <h4>{group.name}</h4>
      <hr />
      <div className='participants'>
        {group.groupMetadata.participants.slice(0, 5).map(x => (
          <img key={x.id.user} src={x.profilePicture} alt={x.id.user} className='rounded' />
        ))}
      </div>
    </button>
  );
}


