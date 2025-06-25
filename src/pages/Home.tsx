interface Props {
    onEnter: () => void;
    onOpenSettings: () => void;
  }
  
  export default function HomeScreen({ onEnter, onOpenSettings }: Props) {
    return (
      <div id="homeScreen">
        <div className="logo">✈️ Maps Airport</div>
        <button onClick={onEnter}>Entrer</button>
        <button onClick={onOpenSettings}>Paramètres</button>
      </div>
    );
  }
  