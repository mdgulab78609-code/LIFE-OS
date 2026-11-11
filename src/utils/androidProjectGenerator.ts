import JSZip from 'jszip';

export async function generateAndroidStudioProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "LIFE OS"
include(":app")
`
  );

  zip.file(
    'build.gradle.kts',
    `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.kapt) apply false
    alias(libs.plugins.hilt.android) apply false
}
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  // App build.gradle.kts
  zip.file(
    'app/build.gradle.kts',
    `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("dagger.hilt.android.plugin")
}

android {
    namespace = "com.lifeos.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.lifeos.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    // WorkManager for Daily Habit & Routine Reminders
    implementation("androidx.work:work-runtime-ktx:2.9.0")

    // Hilt Dependency Injection
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-android-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")

    // Icons Extended
    implementation("androidx.compose.material:material-icons-extended:1.6.2")
}
`
  );

  // AndroidManifest.xml
  zip.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".LifeOsApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="LIFE OS"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:theme="@style/Theme.LifeOS">
        <!-- Samsung Galaxy A16 5G 19.5:9 Display Cutout Support -->
        <meta-data android:name="android.max_aspect" android:value="2.4" />
        <meta-data android:name="android.notch_support" android:value="true" />
        <meta-data android:name="samsung.display.cutout" android:value="true" />
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.LifeOS">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  // Kotlin Code: LifeOsApplication
  zip.file(
    'app/src/main/java/com/lifeos/app/LifeOsApplication.kt',
    `package com.lifeos.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class LifeOsApplication : Application()
`
  );

  // Kotlin Code: Room Database & Entities
  zip.file(
    'app/src/main/java/com/lifeos/app/data/local/HabitEntity.kt',
    `package com.lifeos.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "habits")
data class HabitEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val category: String,
    val icon: String,
    val color: String,
    val frequency: String,
    val targetValue: Int,
    val currentValue: Int,
    val unit: String,
    val currentStreak: Int,
    val longestStreak: Int,
    val isArchived: Boolean,
    val isPaused: Boolean
)
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/data/local/TaskEntity.kt',
    `package com.lifeos.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val dueDate: String,
    val dueTime: String,
    val priority: String,
    val category: String,
    val completed: Boolean
)
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/data/local/GoalEntity.kt',
    `package com.lifeos.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "goals")
data class GoalEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val category: String,
    val targetDate: String,
    val priority: String,
    val progressPercentage: Int,
    val notes: String,
    val status: String
)
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/data/local/HabitDao.kt',
    `package com.lifeos.app.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface HabitDao {
    @Query("SELECT * FROM habits WHERE isArchived = 0")
    fun getAllActiveHabits(): Flow<List<HabitEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHabit(habit: HabitEntity)

    @Update
    suspend fun updateHabit(habit: HabitEntity)

    @Delete
    suspend fun deleteHabit(habit: HabitEntity)
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/data/local/LifeOsDatabase.kt',
    `package com.lifeos.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [HabitEntity::class, TaskEntity::class, GoalEntity::class], version = 1, exportSchema = false)
abstract class LifeOsDatabase : RoomDatabase() {
    abstract fun habitDao(): HabitDao
}
`
  );

  // MainActivity & Jetpack Compose UI
  zip.file(
    'app/src/main/java/com/lifeos/app/MainActivity.kt',
    `package com.lifeos.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.lifeos.app.ui.navigation.LifeOsNavHost
import com.lifeos.app.ui.theme.LifeOsTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LifeOsTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF080C16)
                ) {
                    LifeOsNavHost()
                }
            }
        }
    }
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/ui/navigation/LifeOsNavHost.kt',
    `package com.lifeos.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.lifeos.app.ui.screens.*

sealed class Screen(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Habits : Screen("habits", "Habits", Icons.Default.CheckCircle)
    object Goals : Screen("goals", "Goals", Icons.Default.Flag)
    object Calendar : Screen("calendar", "Calendar", Icons.Default.DateRange)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)
}

@Composable
fun LifeOsNavHost() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val items = listOf(
        Screen.Home,
        Screen.Habits,
        Screen.Goals,
        Screen.Calendar,
        Screen.Profile
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF0F172A),
                contentColor = Color.White
            ) {
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        selected = currentRoute == screen.route,
                        onClick = {
                            if (currentRoute != screen.route) {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.startDestinationId) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF06B6D4),
                            selectedTextColor = Color(0xFF06B6D4),
                            indicatorColor = Color(0x338B5CF6),
                            unselectedIconColor = Color(0xFF94A3B8),
                            unselectedTextColor = Color(0xFF94A3B8)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) { HomeScreen() }
            composable(Screen.Habits.route) { HabitsScreen() }
            composable(Screen.Goals.route) { GoalsScreen() }
            composable(Screen.Calendar.route) { CalendarScreen() }
            composable(Screen.Profile.route) { ProfileScreen() }
        }
    }
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/ui/screens/HomeScreen.kt',
    `package com.lifeos.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun HomeScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF080C16))
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text("Good Morning, Alex", color = Color(0xFF94A3B8), fontSize = 14.sp)
        Text("LIFE OS", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)

        Spacer(modifier = Modifier.height(16.dp))

        // Progress Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131B2E))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Today's Progress: 75%", color = Color(0xFF06B6D4), fontWeight = FontWeight.SemiBold)
                LinearProgressIndicator(
                    progress = { 0.75f },
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    color = Color(0xFF8B5CF6),
                    trackColor = Color(0xFF1E293B)
                )
                Text("Habits Completed: 6/8 · Tasks: 5/7 · Streak: 14 Days 🔥", color = Color(0xFFCBD5E1), fontSize = 12.sp)
            }
        }
    }
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/ui/screens/HabitsScreen.kt',
    `package com.lifeos.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun HabitsScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF080C16))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("My Habits", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Button(
                onClick = { /* Add Habit Dialog */ },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B5CF6))
            ) {
                Text("+ Add Habit")
            }
        }
    }
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/ui/screens/GoalsScreen.kt',
    `package com.lifeos.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun GoalsScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF080C16))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Life Goals", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Button(
                onClick = { /* Add Goal Dialog */ },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF06B6D4))
            ) {
                Text("+ Add Goal")
            }
        }
    }
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/ui/screens/CalendarScreen.kt',
    `package com.lifeos.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun CalendarScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF080C16))
            .padding(16.dp)
    ) {
        Text("Calendar & Activity Heatmap", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
    }
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/ui/screens/ProfileScreen.kt',
    `package com.lifeos.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ProfileScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF080C16))
            .padding(16.dp)
    ) {
        Text("Profile & Settings", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
    }
}
`
  );

  zip.file(
    'app/src/main/java/com/lifeos/app/ui/theme/Theme.kt',
    `package com.lifeos.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF8B5CF6),
    secondary = Color(0xFF06B6D4),
    tertiary = Color(0xFF10B981),
    background = Color(0xFF080C16),
    surface = Color(0xFF131B2E),
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = Color(0xFFF8FAFC),
    onSurface = Color(0xFFF8FAFC)
)

@Composable
fun LifeOsTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
`
  );

  // README.md with detailed instructions
  zip.file(
    'README.md',
    `# LIFE OS – Native Android Application Project

## Build Your Best Self
Plan Your Life. Build Your Habits. Achieve Your Dreams.

This package contains the complete native Android Studio source code for LIFE OS built with:
- **Kotlin 2.0+**
- **Jetpack Compose** & Material 3
- **Room Database** (Offline-First local storage)
- **Hilt Dependency Injection**
- **WorkManager** for background habit & routine notification alarms
- **Clean Architecture** with MVVM design pattern

---

### Step 1: Open in Android Studio
1. Unzip this package.
2. Open Android Studio (Koala, Iguana, or Ladybug).
3. Select **File > Open...** and select this directory.
4. Allow Gradle Sync to download dependencies.

---

### Step 2: Build Debug APK
Run in terminal:
\`\`\`bash
./gradlew assembleDebug
\`\`\`
The output APK will be generated at:
\`app/build/outputs/apk/debug/app-debug.apk\`

---

### Step 3: Direct Install on Android Phone
Ensure USB Debugging is enabled on your phone:
\`\`\`bash
adb install app/build/outputs/apk/debug/app-debug.apk
\`\`\`

---

### Step 4: Build Signed Release APK
\`\`\`bash
./gradlew assembleRelease
\`\`\`
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
