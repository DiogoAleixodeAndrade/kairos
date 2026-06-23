import { Tabs } from "expo-router";
import { Brain, Dumbbell, Home, LineChart, User, Utensils } from "lucide-react-native";

const activeColor = "#D6A84F";
const inactiveColor = "#8B8E99";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: "#080A12",
          borderTopColor: "rgba(255,255,255,0.08)",
          height: 86,
          paddingTop: 10,
          paddingBottom: 18,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarIcon: ({ color, size }) => <Utensils color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="training"
        options={{
          title: "Treino",
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: "IA",
          tabBarIcon: ({ color, size }) => <Brain color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progresso",
          tabBarIcon: ({ color, size }) => <LineChart color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}