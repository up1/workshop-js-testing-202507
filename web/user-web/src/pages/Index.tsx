// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            User Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern and intuitive platform to manage your users efficiently. 
            Create new users and view your complete user directory with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-elegant hover:shadow-lg transition-smooth group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Create New User</CardTitle>
              <CardDescription>
                Add a new user to your system with name, email, and age information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/create-user">
                <Button className="bg-gradient-primary hover:opacity-90 transition-smooth w-full">
                  Create User
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-lg transition-smooth group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">View All Users</CardTitle>
              <CardDescription>
                Browse through your complete user directory and manage existing users
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/users">
                <Button variant="outline" className="w-full transition-smooth hover:bg-accent">
                  View Users
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            Built with React, TypeScript, and modern design principles
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
