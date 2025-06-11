#!/usr/bin/env python3
"""
Augment Code Complete Removal Script
This script removes all Augment Code data, extensions, and configurations from your system.
"""

import os
import sys
import shutil
import platform
import subprocess
import json
import glob
from pathlib import Path
import winreg if platform.system() == "Windows" else None

class AugmentCodeCleaner:
    def __init__(self):
        self.system = platform.system()
        self.home = Path.home()
        self.removed_items = []
        self.errors = []
        
    def log_action(self, action, success=True):
        """Log actions taken during cleanup"""
        status = "✓" if success else "✗"
        print(f"{status} {action}")
        if success:
            self.removed_items.append(action)
        else:
            self.errors.append(action)
    
    def safe_remove(self, path, description):
        """Safely remove files or directories"""
        try:
            path_obj = Path(path)
            if path_obj.exists():
                if path_obj.is_file():
                    path_obj.unlink()
                elif path_obj.is_dir():
                    shutil.rmtree(path_obj)
                self.log_action(f"Removed {description}: {path}")
                return True
            else:
                self.log_action(f"Not found {description}: {path}")
                return True
        except Exception as e:
            self.log_action(f"Failed to remove {description}: {path} - {e}", False)
            return False
    
    def get_vscode_paths(self):
        """Get VS Code installation and data paths"""
        paths = []
        
        if self.system == "Windows":
            # VS Code user data
            paths.extend([
                self.home / "AppData/Roaming/Code",
                self.home / "AppData/Local/Programs/Microsoft VS Code",
                self.home / ".vscode",
                Path(os.environ.get('APPDATA', '')) / "Code",
            ])
        elif self.system == "Darwin":  # macOS
            paths.extend([
                self.home / "Library/Application Support/Code",
                self.home / ".vscode",
                Path("/Applications/Visual Studio Code.app"),
            ])
        else:  # Linux
            paths.extend([
                self.home / ".config/Code",
                self.home / ".vscode",
                Path("/usr/share/code"),
                Path("/opt/visual-studio-code"),
            ])
        
        return paths
    
    def remove_vscode_extensions(self):
        """Remove Augment Code VS Code extensions"""
        print("\n🔍 Removing VS Code Extensions...")
        
        vscode_paths = self.get_vscode_paths()
        
        for base_path in vscode_paths:
            if not base_path.exists():
                continue
                
            # Extensions directory
            ext_dir = base_path / "extensions"
            if ext_dir.exists():
                for item in ext_dir.iterdir():
                    if "augment" in item.name.lower():
                        self.safe_remove(item, "VS Code Augment extension")
        
        # Also check common extension patterns
        extension_patterns = [
            "augment*",
            "*augment*",
            "augmentcode*"
        ]
        
        for pattern in extension_patterns:
            for vscode_path in vscode_paths:
                ext_path = vscode_path / "extensions"
                if ext_path.exists():
                    for match in ext_path.glob(pattern):
                        self.safe_remove(match, f"VS Code extension (pattern: {pattern})")
    
    def clean_vscode_settings(self):
        """Clean Augment Code settings from VS Code"""
        print("\n🔧 Cleaning VS Code Settings...")
        
        settings_paths = []
        
        if self.system == "Windows":
            settings_paths = [
                self.home / "AppData/Roaming/Code/User/settings.json",
                self.home / ".vscode/settings.json"
            ]
        elif self.system == "Darwin":
            settings_paths = [
                self.home / "Library/Application Support/Code/User/settings.json",
                self.home / ".vscode/settings.json"
            ]
        else:
            settings_paths = [
                self.home / ".config/Code/User/settings.json",
                self.home / ".vscode/settings.json"
            ]
        
        for settings_file in settings_paths:
            if settings_file.exists():
                try:
                    with open(settings_file, 'r') as f:
                        settings = json.load(f)
                    
                    # Remove Augment-related settings
                    keys_to_remove = [key for key in settings.keys() if 'augment' in key.lower()]
                    
                    if keys_to_remove:
                        for key in keys_to_remove:
                            del settings[key]
                        
                        with open(settings_file, 'w') as f:
                            json.dump(settings, f, indent=2)
                        
                        self.log_action(f"Cleaned Augment settings from {settings_file}")
                    else:
                        self.log_action(f"No Augment settings found in {settings_file}")
                        
                except Exception as e:
                    self.log_action(f"Failed to clean settings in {settings_file}: {e}", False)
    
    def remove_application_data(self):
        """Remove Augment application data"""
        print("\n📁 Removing Application Data...")
        
        data_paths = []
        
        if self.system == "Windows":
            data_paths = [
                self.home / "AppData/Roaming/Augment",
                self.home / "AppData/Local/Augment",
                self.home / ".augment",
                Path(os.environ.get('APPDATA', '')) / "Augment",
                Path(os.environ.get('LOCALAPPDATA', '')) / "Augment",
            ]
        elif self.system == "Darwin":
            data_paths = [
                self.home / "Library/Application Support/Augment",
                self.home / "Library/Caches/Augment",
                self.home / "Library/Preferences/com.augment.*",
                self.home / ".augment",
            ]
        else:
            data_paths = [
                self.home / ".config/augment",
                self.home / ".local/share/augment",
                self.home / ".cache/augment",
                self.home / ".augment",
            ]
        
        for path in data_paths:
            if "*" in str(path):
                # Handle glob patterns
                for match in glob.glob(str(path)):
                    self.safe_remove(match, "Augment application data")
            else:
                self.safe_remove(path, "Augment application data")
    
    def clean_registry_windows(self):
        """Clean Windows registry entries (Windows only)"""
        if self.system != "Windows":
            return
            
        print("\n🗂️ Cleaning Windows Registry...")
        
        try:
            import winreg
            
            registry_paths = [
                (winreg.HKEY_CURRENT_USER, r"Software\Augment"),
                (winreg.HKEY_LOCAL_MACHINE, r"Software\Augment"),
                (winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Uninstall"),
            ]
            
            for hkey, path in registry_paths:
                try:
                    key = winreg.OpenKey(hkey, path, 0, winreg.KEY_ALL_ACCESS)
                    
                    # For uninstall key, look for Augment entries
                    if "Uninstall" in path:
                        i = 0
                        while True:
                            try:
                                subkey_name = winreg.EnumKey(key, i)
                                if "augment" in subkey_name.lower():
                                    winreg.DeleteKey(key, subkey_name)
                                    self.log_action(f"Removed registry key: {path}\\{subkey_name}")
                                else:
                                    i += 1
                            except WindowsError:
                                break
                    else:
                        winreg.DeleteKey(hkey, path)
                        self.log_action(f"Removed registry key: {path}")
                    
                    winreg.CloseKey(key)
                    
                except FileNotFoundError:
                    self.log_action(f"Registry key not found: {path}")
                except Exception as e:
                    self.log_action(f"Failed to clean registry key {path}: {e}", False)
                    
        except ImportError:
            self.log_action("winreg module not available", False)
    
    def clear_browser_data(self):
        """Clear browser data related to Augment"""
        print("\n🌐 Note: Browser Data Cleanup...")
        print("Please manually clear browser data for Augment domains:")
        print("- Clear cookies and site data for augmentcode.com")
        print("- Clear localStorage and sessionStorage")
        print("- Clear browser cache")
    
    def kill_processes(self):
        """Kill any running Augment processes"""
        print("\n⚡ Stopping Augment Processes...")
        
        process_names = ["augment", "augmentcode", "code"]
        
        for proc_name in process_names:
            try:
                if self.system == "Windows":
                    result = subprocess.run(
                        ["taskkill", "/F", "/IM", f"{proc_name}.exe"],
                        capture_output=True, text=True
                    )
                    if result.returncode == 0:
                        self.log_action(f"Killed process: {proc_name}.exe")
                else:
                    result = subprocess.run(
                        ["pkill", "-f", proc_name],
                        capture_output=True, text=True
                    )
                    if result.returncode == 0:
                        self.log_action(f"Killed process: {proc_name}")
            except Exception as e:
                self.log_action(f"Failed to kill process {proc_name}: {e}", False)
    
    def run_cleanup(self):
        """Run the complete cleanup process"""
        print("🧹 Augment Code Complete Removal Tool")
        print("=" * 50)
        print(f"Operating System: {self.system}")
        print(f"Home Directory: {self.home}")
        print()
        
        # Confirm before proceeding
        response = input("⚠️  This will permanently delete all Augment Code data. Continue? (y/N): ")
        if response.lower() != 'y':
            print("❌ Cleanup cancelled.")
            return
        
        print("\n🚀 Starting cleanup process...")
        
        # Kill processes first
        self.kill_processes()
        
        # Remove VS Code extensions
        self.remove_vscode_extensions()
        
        # Clean VS Code settings
        self.clean_vscode_settings()
        
        # Remove application data
        self.remove_application_data()
        
        # Clean registry (Windows only)
        self.clean_registry_windows()
        
        # Browser data note
        self.clear_browser_data()
        
        # Summary
        print("\n" + "=" * 50)
        print("🎉 Cleanup Summary")
        print("=" * 50)
        print(f"✅ Successfully removed: {len(self.removed_items)} items")
        print(f"❌ Errors encountered: {len(self.errors)} items")
        
        if self.errors:
            print("\n⚠️  Errors:")
            for error in self.errors:
                print(f"  - {error}")
        
        print("\n✨ Augment Code cleanup completed!")
        print("💡 Restart your computer to ensure all changes take effect.")

if __name__ == "__main__":
    cleaner = AugmentCodeCleaner()
    cleaner.run_cleanup()
