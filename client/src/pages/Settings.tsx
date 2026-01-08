import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, User, Shield, Palette, Mail } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account preferences and application settings.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-secondary/50 backdrop-blur-sm">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jodoe@utmb.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue="Information Technology" disabled className="bg-muted" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 pt-6">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive via email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Compliance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when accessibility scores drop below threshold.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Get a weekly summary of department performance.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Interface Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`cursor-pointer rounded-lg border-2 p-1 hover:border-primary ${theme === 'light' ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="space-y-2 rounded-md bg-[#f0f4f8] p-2">
                      <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-2 w-[80px] rounded-lg bg-[#e2e8f0]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#e2e8f0]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#e2e8f0]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#e2e8f0]" />
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal text-sm">Light</span>
                  </div>
                  
                  <div 
                    className={`cursor-pointer rounded-lg border-2 p-1 hover:border-primary ${theme === 'dark' ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="space-y-2 rounded-md bg-slate-950 p-2">
                      <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal text-sm">Dark</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations for a simpler experience.</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
