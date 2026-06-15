const ComponentFunction = function() {
  // @section:imports @depends:[]
  var React = require('react');
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useContext = React.useContext;
  var useMemo = React.useMemo;
  var useCallback = React.useCallback;
  var RN = require('react-native');
  var View = RN.View;
  var Text = RN.Text;
  var StyleSheet = RN.StyleSheet;
  var ScrollView = RN.ScrollView;
  var TouchableOpacity = RN.TouchableOpacity;
  var TextInput = RN.TextInput;
  var Modal = RN.Modal;
  var Alert = RN.Alert;
  var Platform = RN.Platform;
  var StatusBar = RN.StatusBar;
  var ActivityIndicator = RN.ActivityIndicator;
  var KeyboardAvoidingView = RN.KeyboardAvoidingView;
  var FlatList = RN.FlatList;
  var Dimensions = RN.Dimensions;
  var Image = RN.Image;
  var MaterialIcons = require('@expo/vector-icons').MaterialIcons;
  var Ionicons = require('@expo/vector-icons').Ionicons;
  var FontAwesome = require('@expo/vector-icons').FontAwesome;
  var createBottomTabNavigator = require('@react-navigation/bottom-tabs').createBottomTabNavigator;
  var createStackNavigator = require('@react-navigation/stack').createStackNavigator;
  var useSafeAreaInsets = require('react-native-safe-area-context').useSafeAreaInsets;
  var platformHooks = require('platform-hooks');
  var useQuery = platformHooks.useQuery;
  var useMutation = platformHooks.useMutation;
  var useFilePicker = platformHooks.useFilePicker;
  var useShare = platformHooks.useShare;
  // @end:imports

  // @section:theme @depends:[]
  var primaryColor = '#1E40AF';
  var accentColor = '#3B82F6';
  var backgroundColor = '#F0F4FF';
  var cardColor = '#FFFFFF';
  var textPrimary = '#1E293B';
  var textSecondary = '#64748B';
  var borderColor = '#CBD5E1';
  var successColor = '#10B981';
  var errorColor = '#EF4444';
  var warningColor = '#F59E0B';
  var goldColor = '#D97706';
  var TAB_MENU_HEIGHT = Platform.OS === 'web' ? 56 : 49;
  var SCROLL_EXTRA_PADDING = 16;
  var WEB_TAB_MENU_PADDING = 90;
  var FAB_SPACING = 16;
  var HEADER_HEIGHT = 60;
  // @end:theme

  // @section:navigation-setup @depends:[]
  var Tab = createBottomTabNavigator();
  var Stack = createStackNavigator();
  // @end:navigation-setup

  // @section:static-data @depends:[]
  var CASE_CATEGORIES = ['Property', 'Divorce/Family', 'Business', 'Criminal', 'Traffic', 'Employment', 'Consumer', 'Civil'];
  var CONSULTATION_MODES = ['In-Person', 'Video Call', 'Audio Call', 'Chat'];
  var DISTRICTS = [
    'Ahmedabad', 'Bangalore', 'Bhopal', 'Chennai', 'Coimbatore',
    'Delhi', 'Ernakulam', 'Hyderabad', 'Indore', 'Jaipur',
    'Kolkata', 'Lucknow', 'Mumbai', 'Nagpur', 'Patna',
    'Pune', 'Rajkot', 'Surat', 'Thiruvananthapuram', 'Vadodara',
    'Visakhapatnam', 'Agra', 'Nashik', 'Meerut', 'Chandigarh'
  ];
  var EXPERIENCE_LEVELS = ['1-3 years', '4-7 years', '8-12 years', '13-20 years', '20+ years'];
  var SEED_ADVOCATES = [
    { id: 'adv-seed-1', name: 'Rajesh Kumar Sharma', specialization: 'Criminal Law', experience: '12 years', district: 'Delhi', rating: 4.8, cases: 142, image: 'IMAGE:professional-lawyer-portrait-male' },
    { id: 'adv-seed-2', name: 'Priya Venkataraman', specialization: 'Family & Divorce', experience: '8 years', district: 'Chennai', rating: 4.9, cases: 98, image: 'IMAGE:professional-woman-lawyer-portrait' },
    { id: 'adv-seed-3', name: 'Aditya Singh Rajput', specialization: 'Property Law', experience: '15 years', district: 'Mumbai', rating: 4.7, cases: 205, image: 'IMAGE:indian-lawyer-professional-man' },
    { id: 'adv-seed-4', name: 'Sunita Mehta', specialization: 'Corporate Law', experience: '10 years', district: 'Bangalore', rating: 4.6, cases: 76, image: 'IMAGE:professional-lawyer-woman-office' },
    { id: 'adv-seed-5', name: 'Mohammed Farouk', specialization: 'Consumer Law', experience: '6 years', district: 'Hyderabad', rating: 4.5, cases: 53, image: 'IMAGE:lawyer-professional-portrait-suit' },
    { id: 'adv-seed-6', name: 'Kavitha Nair', specialization: 'Civil Law', experience: '18 years', district: 'Pune', rating: 4.9, cases: 310, image: 'IMAGE:senior-professional-lawyer-woman' }
  ];
  // @end:static-data

  // @section:AppContext @depends:[static-data]
  var AppContext = React.createContext({
    currentUser: null,
    setCurrentUser: function() {},
    userRole: null,
    setUserRole: function() {}
  });
  var AppProvider = function(props) {
    var userState = useState(null);
    var currentUser = userState[0];
    var setCurrentUser = userState[1];
    var roleState = useState(null);
    var userRole = roleState[0];
    var setUserRole = roleState[1];
    var value = useMemo(function() {
      return { currentUser: currentUser, setCurrentUser: setCurrentUser, userRole: userRole, setUserRole: setUserRole };
    }, [currentUser, userRole]);
    return React.createElement(AppContext.Provider, { value: value }, props.children);
  };
  var useAppContext = function() { return useContext(AppContext); };
  // @end:AppContext

  // @section:ThemeContext @depends:[theme]
  var ThemeContext = React.createContext({ theme: { colors: { primary: primaryColor, accent: accentColor, background: backgroundColor, card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary, border: borderColor } }, designStyle: 'professional' });
  var ThemeProvider = function(props) {
    var lightTheme = useMemo(function() {
      return { colors: { primary: primaryColor, accent: accentColor, background: backgroundColor, card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary, border: borderColor, success: successColor, error: errorColor, warning: warningColor, gold: goldColor } };
    }, []);
    var value = useMemo(function() { return { theme: lightTheme, designStyle: 'professional' }; }, [lightTheme]);
    return React.createElement(ThemeContext.Provider, { value: value }, props.children);
  };
  var useTheme = function() { return useContext(ThemeContext); };
  // @end:ThemeContext

  // @section:LandingScreen @depends:[ThemeContext,styles]
  var LandingScreen = function(props) {
    var navigation = props.navigation;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.primary }, componentId: 'landing-screen' },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: theme.colors.primary }),
      React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: insets.top, paddingBottom: insets.bottom + 40, paddingHorizontal: 32 } },
        React.createElement(View, { style: { alignItems: 'center', marginBottom: 60 }, componentId: 'landing-logo' },
          React.createElement(View, { style: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 } },
            React.createElement(Text, { style: { fontSize: 40, fontWeight: '900', color: '#FFFFFF' } }, 'L&R')
          ),
          React.createElement(Text, { style: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 } }, 'L&R Legal'),
          React.createElement(Text, { style: { fontSize: 16, color: 'rgba(255,255,255,0.75)', marginTop: 8, textAlign: 'center' } }, 'Connecting Clients with Advocates')
        ),
        React.createElement(View, { style: { alignItems: 'center', marginBottom: 40 }, componentId: 'landing-tagline' },
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 } },
            React.createElement(MaterialIcons, { name: 'verified', size: 18, color: 'rgba(255,255,255,0.8)' }),
            React.createElement(Text, { style: { color: 'rgba(255,255,255,0.8)', marginLeft: 8, fontSize: 14 } }, 'Verified Advocates')
          ),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 } },
            React.createElement(MaterialIcons, { name: 'security', size: 18, color: 'rgba(255,255,255,0.8)' }),
            React.createElement(Text, { style: { color: 'rgba(255,255,255,0.8)', marginLeft: 8, fontSize: 14 } }, 'Secure Case Management')
          ),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
            React.createElement(MaterialIcons, { name: 'video-call', size: 18, color: 'rgba(255,255,255,0.8)' }),
            React.createElement(Text, { style: { color: 'rgba(255,255,255,0.8)', marginLeft: 8, fontSize: 14 } }, 'Multiple Consultation Modes')
          )
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, width: '100%', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
          onPress: function() { navigation.navigate('Login'); },
          componentId: 'landing-login-btn'
        },
          React.createElement(Text, { style: { color: theme.colors.primary, fontSize: 17, fontWeight: '700' } }, 'Login')
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: 'transparent', borderRadius: 12, paddingVertical: 16, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
          onPress: function() { navigation.navigate('SignUp'); },
          componentId: 'landing-signup-btn'
        },
          React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' } }, 'Sign Up')
        )
      )
    );
  };
  // @end:LandingScreen

  // @section:LoginScreen @depends:[ThemeContext,styles]
  var LoginScreen = function(props) {
    var navigation = props.navigation;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var appCtx = useAppContext();
    var insets = useSafeAreaInsets();
    var usernameState = useState('');
    var username = usernameState[0];
    var setUsername = usernameState[1];
    var emailState = useState('');
    var email = emailState[0];
    var setEmail = emailState[1];
    var passwordState = useState('');
    var password = passwordState[0];
    var setPassword = passwordState[1];
    var verifState = useState('');
    var verifCode = verifState[0];
    var setVerifCode = verifState[1];
    var loadingState = useState(false);
    var loading = loadingState[0];
    var setLoading = loadingState[1];
    var winH = Dimensions.get('window').height;
    var scrollH = winH - insets.top - insets.bottom;

    var handleLogin = function() {
      if (!username || !email || !password || !verifCode) {
        Platform.OS === 'web' ? window.alert('Please fill all fields') : Alert.alert('Error', 'Please fill all fields');
        return;
      }
      setLoading(true);
      setTimeout(function() {
        setLoading(false);
        appCtx.setCurrentUser({ username: username, email: email });
        navigation.navigate('RoleSelection', { username: username, password: password, email: email, isLogin: true });
      }, 800);
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'login-screen' },
      React.createElement(StatusBar, { barStyle: 'dark-content', backgroundColor: theme.colors.background }),
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 10, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }, componentId: 'login-header' },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { marginRight: 16 }, componentId: 'login-back-btn' },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFFFFF' })
        ),
        React.createElement(Text, { style: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' } }, 'Login to L&R')
      ),
      React.createElement(ScrollView, { style: Platform.OS === 'web' ? { height: scrollH, overflow: 'auto' } : { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: 40 } },
        React.createElement(View, { style: { alignItems: 'center', marginBottom: 32 }, componentId: 'login-icon' },
          React.createElement(View, { style: { width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center' } },
            React.createElement(MaterialIcons, { name: 'lock', size: 36, color: theme.colors.primary })
          ),
          React.createElement(Text, { style: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 12 } }, 'Welcome back!')
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Username'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'person', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: username, onChangeText: setUsername,
            placeholder: 'Enter username', placeholderTextColor: '#9CA3AF',
            autoCapitalize: 'none', autoCorrect: false, componentId: 'login-username-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Email'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'email', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: email, onChangeText: setEmail,
            placeholder: 'Enter email address', placeholderTextColor: '#9CA3AF',
            keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false,
            componentId: 'login-email-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Password'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'lock-outline', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: password, onChangeText: setPassword,
            placeholder: 'Enter password', placeholderTextColor: '#9CA3AF',
            secureTextEntry: true, autoCapitalize: 'none', autoCorrect: false,
            componentId: 'login-password-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Verification Code'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 32 } },
          React.createElement(MaterialIcons, { name: 'verified-user', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: verifCode, onChangeText: function(t) { setVerifCode(t.replace(/[^0-9]/g, '')); },
            placeholder: 'Enter 6-digit code', placeholderTextColor: '#9CA3AF',
            keyboardType: 'numeric', componentId: 'login-verif-input'
          })
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: loading ? '#93C5FD' : theme.colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: theme.colors.primary, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
          onPress: handleLogin, disabled: loading, componentId: 'login-submit-btn'
        },
          loading ? React.createElement(ActivityIndicator, { color: '#FFFFFF' }) : React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' } }, 'Login')
        ),
        React.createElement(TouchableOpacity, { style: { alignItems: 'center', marginTop: 20 }, onPress: function() { navigation.navigate('SignUp'); }, componentId: 'login-goto-signup' },
          React.createElement(Text, { style: { color: theme.colors.accent, fontSize: 15 } }, "Don't have an account? Sign Up")
        )
      )
    );
  };
  // @end:LoginScreen

  // @section:SignUpScreen @depends:[ThemeContext,styles]
  var SignUpScreen = function(props) {
    var navigation = props.navigation;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var usernameState = useState('');
    var username = usernameState[0];
    var setUsername = usernameState[1];
    var passwordState = useState('');
    var password = passwordState[0];
    var setPassword = passwordState[1];
    var winH = Dimensions.get('window').height;
    var scrollH = winH - insets.top - insets.bottom;

    var handleNext = function() {
      if (!username || !password) {
        Platform.OS === 'web' ? window.alert('Please fill all fields') : Alert.alert('Error', 'Please fill all fields');
        return;
      }
      if (password.length < 6) {
        Platform.OS === 'web' ? window.alert('Password must be at least 6 characters') : Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
      navigation.navigate('RoleSelection', { username: username, password: password });
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'signup-screen' },
      React.createElement(StatusBar, { barStyle: 'dark-content', backgroundColor: theme.colors.background }),
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 10, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }, componentId: 'signup-header' },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { marginRight: 16 }, componentId: 'signup-back-btn' },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFFFFF' })
        ),
        React.createElement(Text, { style: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' } }, 'Create Account')
      ),
      React.createElement(ScrollView, { style: Platform.OS === 'web' ? { height: scrollH, overflow: 'auto' } : { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: 40 } },
        React.createElement(View, { style: { alignItems: 'center', marginBottom: 32 }, componentId: 'signup-icon' },
          React.createElement(View, { style: { width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center' } },
            React.createElement(MaterialIcons, { name: 'person-add', size: 36, color: theme.colors.primary })
          ),
          React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, marginTop: 12 } }, 'Step 1 of 2'),
          React.createElement(Text, { style: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 } }, 'Create your credentials')
        ),
        React.createElement(View, { style: { backgroundColor: theme.colors.primary + '10', borderRadius: 12, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center' } },
          React.createElement(MaterialIcons, { name: 'info', size: 20, color: theme.colors.primary }),
          React.createElement(Text, { style: { flex: 1, marginLeft: 10, color: theme.colors.primary, fontSize: 13 } }, 'You will choose your role (Advocate or Client) in the next step.')
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Username'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'person', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: username, onChangeText: setUsername,
            placeholder: 'Choose a username', placeholderTextColor: '#9CA3AF',
            autoCapitalize: 'none', autoCorrect: false, componentId: 'signup-username-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Password'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 32 } },
          React.createElement(MaterialIcons, { name: 'lock-outline', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: password, onChangeText: setPassword,
            placeholder: 'Create password (min 6 chars)', placeholderTextColor: '#9CA3AF',
            secureTextEntry: true, autoCapitalize: 'none', autoCorrect: false,
            componentId: 'signup-password-input'
          })
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: theme.colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: theme.colors.primary, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
          onPress: handleNext, componentId: 'signup-next-btn'
        },
          React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginRight: 8 } }, 'Next'),
          React.createElement(MaterialIcons, { name: 'arrow-forward', size: 20, color: '#FFFFFF' })
        )
      )
    );
  };
  // @end:SignUpScreen

  // @section:RoleSelectionScreen @depends:[ThemeContext,styles]
  var RoleSelectionScreen = function(props) {
    var navigation = props.navigation;
    var route = props.route;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var params = route && route.params ? route.params : {};
    var username = params.username || '';
    var password = params.password || '';
    var email = params.email || '';
    var isLogin = params.isLogin || false;

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'role-screen' },
      React.createElement(StatusBar, { barStyle: 'dark-content', backgroundColor: theme.colors.background }),
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 10, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }, componentId: 'role-header' },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { marginRight: 16 }, componentId: 'role-back-btn' },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFFFFF' })
        ),
        React.createElement(Text, { style: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' } }, 'Choose Your Role')
      ),
      React.createElement(View, { style: { flex: 1, padding: 24, justifyContent: 'center' } },
        React.createElement(Text, { style: { fontSize: 26, fontWeight: '800', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 8 }, componentId: 'role-title' }, 'Who are you?'),
        React.createElement(Text, { style: { fontSize: 15, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 48 } }, 'Select your role to continue'),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: cardColor, borderRadius: 16, padding: 28, marginBottom: 20, alignItems: 'center', borderWidth: 2, borderColor: theme.colors.primary, shadowColor: theme.colors.primary, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
          onPress: function() { navigation.navigate('AdvocateReg', { username: username, password: password }); },
          componentId: 'role-advocate-btn'
        },
          React.createElement(View, { style: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 } },
            React.createElement(MaterialIcons, { name: 'gavel', size: 40, color: theme.colors.primary })
          ),
          React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: theme.colors.primary, marginBottom: 6 } }, 'Advocate'),
          React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center' } }, 'I am a legal professional offering\nconsultation and case services')
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: cardColor, borderRadius: 16, padding: 28, alignItems: 'center', borderWidth: 2, borderColor: '#10B981', shadowColor: '#10B981', shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
          onPress: function() { navigation.navigate('ClientReg', { username: username, password: password }); },
          componentId: 'role-client-btn'
        },
          React.createElement(View, { style: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981' + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 } },
            React.createElement(MaterialIcons, { name: 'person', size: 40, color: '#10B981' })
          ),
          React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: '#10B981', marginBottom: 6 } }, 'Client'),
          React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center' } }, 'I am seeking legal advice\nand representation')
        )
      )
    );
  };
  // @end:RoleSelectionScreen

  // @section:AdvocateRegScreen @depends:[ThemeContext,styles]
  var AdvocateRegScreen = function(props) {
    var navigation = props.navigation;
    var route = props.route;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var appCtx = useAppContext();
    var insets = useSafeAreaInsets();
    var params = route && route.params ? route.params : {};
    var username = params.username || '';
    var password = params.password || '';

    var barNumState = useState('');
    var barNum = barNumState[0];
    var setBarNum = barNumState[1];
    var expState = useState('');
    var experience = expState[0];
    var setExperience = expState[1];
    var districtState = useState('');
    var district = districtState[0];
    var setDistrict = districtState[1];
    var showExpState = useState(false);
    var showExpModal = showExpState[0];
    var setShowExpModal = showExpState[1];
    var showDistState = useState(false);
    var showDistModal = showDistState[0];
    var setShowDistModal = showDistState[1];
    var loadingState = useState(false);
    var loading = loadingState[0];
    var setLoading = loadingState[1];

    var filePickerHook = useFilePicker();
    var pickDocument = filePickerHook.pickDocument;
    var fpLoading = filePickerHook.isLoading;
    var fpError = filePickerHook.error;
    var barCardState = useState(null);
    var barCardFile = barCardState[0];
    var setBarCardFile = barCardState[1];
    var aibeCertState = useState(null);
    var aibeCertFile = aibeCertState[0];
    var setAibeCertFile = aibeCertState[1];
    var pickingTypeState = useState('');
    var pickingType = pickingTypeState[0];
    var setPickingType = pickingTypeState[1];

    var mutHook = useMutation('advocates', 'insert');
    var insertAdvocate = mutHook.mutate;

    var winH = Dimensions.get('window').height;
    var scrollH = winH - insets.top - insets.bottom - HEADER_HEIGHT;

    var handlePickBarCard = function() {
      setPickingType('barcard');
      pickDocument({ type: ['application/pdf', 'image/*'] }).then(function(result) {
        if (!result.cancelled && result.file) { setBarCardFile(result.file); }
        setPickingType('');
      });
    };

    var handlePickAibe = function() {
      setPickingType('aibe');
      pickDocument({ type: ['application/pdf', 'image/*'] }).then(function(result) {
        if (!result.cancelled && result.file) { setAibeCertFile(result.file); }
        setPickingType('');
      });
    };

    var handleRegister = function() {
      if (!barNum || !experience || !district || !barCardFile || !aibeCertFile) {
        Platform.OS === 'web' ? window.alert('Please fill all fields and upload required documents') : Alert.alert('Error', 'Please fill all fields and upload required documents');
        return;
      }
      setLoading(true);
      var newId = 'adv-' + Date.now();
      insertAdvocate({
        id: newId,
        username: username,
        password: password,
        bar_council_number: barNum,
        bar_card_uri: barCardFile.uri,
        aibe_cert_uri: aibeCertFile.uri,
        years_experience: experience,
        district: district,
        created_at: Date.now()
      }).then(function() {
        setLoading(false);
        appCtx.setCurrentUser({ id: newId, username: username, role: 'advocate', district: district, experience: experience });
        appCtx.setUserRole('advocate');
        Platform.OS === 'web' ? window.alert('Registration successful! Welcome, Advocate ' + username) : Alert.alert('Success', 'Registration successful! Welcome, Advocate ' + username);
        navigation.navigate('MainApp');
      }).catch(function(err) {
        setLoading(false);
        Platform.OS === 'web' ? window.alert('Registration failed. Please try again.') : Alert.alert('Error', 'Registration failed. Please try again.');
      });
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'advreg-screen' },
      React.createElement(StatusBar, { barStyle: 'dark-content' }),
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 10, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', minHeight: HEADER_HEIGHT + insets.top }, componentId: 'advreg-header' },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { marginRight: 16 }, componentId: 'advreg-back-btn' },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFFFFF' })
        ),
        React.createElement(View, null,
          React.createElement(Text, { style: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' } }, 'Advocate Registration'),
          React.createElement(Text, { style: { fontSize: 12, color: 'rgba(255,255,255,0.75)' } }, 'Professional credentials required')
        )
      ),
      React.createElement(ScrollView, { style: Platform.OS === 'web' ? { height: scrollH, overflow: 'auto' } : { flex: 1 }, contentContainerStyle: { padding: 20, paddingBottom: 40 } },
        React.createElement(View, { style: { backgroundColor: theme.colors.primary + '10', borderRadius: 12, padding: 14, marginBottom: 20, flexDirection: 'row', alignItems: 'center' } },
          React.createElement(MaterialIcons, { name: 'gavel', size: 22, color: theme.colors.primary }),
          React.createElement(Text, { style: { flex: 1, marginLeft: 10, color: theme.colors.primary, fontSize: 13, fontWeight: '600' } }, 'All fields are mandatory for advocate verification')
        ),
        fpError ? React.createElement(View, { style: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' } },
          React.createElement(MaterialIcons, { name: 'error', size: 18, color: errorColor }),
          React.createElement(Text, { style: { flex: 1, marginLeft: 8, color: errorColor, fontSize: 13 } }, fpError)
        ) : null,
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Bar Council Registration Number'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'badge', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: barNum, onChangeText: setBarNum,
            placeholder: 'e.g. BAR/DL/2015/12345', placeholderTextColor: '#9CA3AF',
            autoCapitalize: 'characters', autoCorrect: false, componentId: 'advreg-barnum-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Bar Council Identity Card'),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: barCardFile ? '#ECFDF5' : cardColor, borderRadius: 10, borderWidth: 1.5, borderColor: barCardFile ? '#10B981' : borderColor, borderStyle: barCardFile ? 'solid' : 'dashed', paddingVertical: 16, paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
          onPress: handlePickBarCard, disabled: fpLoading && pickingType === 'barcard',
          componentId: 'advreg-barcard-btn'
        },
          React.createElement(MaterialIcons, { name: barCardFile ? 'check-circle' : 'upload-file', size: 28, color: barCardFile ? '#10B981' : theme.colors.primary }),
          React.createElement(View, { style: { flex: 1, marginLeft: 12 } },
            React.createElement(Text, { style: { fontSize: 14, fontWeight: '600', color: barCardFile ? '#10B981' : theme.colors.textPrimary } }, barCardFile ? 'Bar Card Uploaded' : 'Upload Bar Council ID Card'),
            React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 } }, barCardFile ? barCardFile.name : 'PDF or Image accepted')
          ),
          fpLoading && pickingType === 'barcard' ? React.createElement(ActivityIndicator, { size: 'small', color: theme.colors.primary }) : null
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'AIBE Certificate'),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: aibeCertFile ? '#ECFDF5' : cardColor, borderRadius: 10, borderWidth: 1.5, borderColor: aibeCertFile ? '#10B981' : borderColor, borderStyle: aibeCertFile ? 'solid' : 'dashed', paddingVertical: 16, paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
          onPress: handlePickAibe, disabled: fpLoading && pickingType === 'aibe',
          componentId: 'advreg-aibe-btn'
        },
          React.createElement(MaterialIcons, { name: aibeCertFile ? 'check-circle' : 'upload-file', size: 28, color: aibeCertFile ? '#10B981' : theme.colors.primary }),
          React.createElement(View, { style: { flex: 1, marginLeft: 12 } },
            React.createElement(Text, { style: { fontSize: 14, fontWeight: '600', color: aibeCertFile ? '#10B981' : theme.colors.textPrimary } }, aibeCertFile ? 'AIBE Certificate Uploaded' : 'Upload AIBE Certificate'),
            React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 } }, aibeCertFile ? aibeCertFile.name : 'PDF or Image accepted')
          ),
          fpLoading && pickingType === 'aibe' ? React.createElement(ActivityIndicator, { size: 'small', color: theme.colors.primary }) : null
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Years of Experience'),
        React.createElement(TouchableOpacity, {
          style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 16 },
          onPress: function() { setShowExpModal(true); }, componentId: 'advreg-exp-btn'
        },
          React.createElement(MaterialIcons, { name: 'work', size: 20, color: textSecondary }),
          React.createElement(Text, { style: { flex: 1, marginLeft: 10, fontSize: 15, color: experience ? textPrimary : '#9CA3AF' } }, experience || 'Select years of experience'),
          React.createElement(MaterialIcons, { name: 'expand-more', size: 24, color: textSecondary })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'District'),
        React.createElement(TouchableOpacity, {
          style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 32 },
          onPress: function() { setShowDistModal(true); }, componentId: 'advreg-district-btn'
        },
          React.createElement(MaterialIcons, { name: 'location-on', size: 20, color: textSecondary }),
          React.createElement(Text, { style: { flex: 1, marginLeft: 10, fontSize: 15, color: district ? textPrimary : '#9CA3AF' } }, district || 'Select district'),
          React.createElement(MaterialIcons, { name: 'expand-more', size: 24, color: textSecondary })
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: loading ? '#93C5FD' : theme.colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: theme.colors.primary, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
          onPress: handleRegister, disabled: loading, componentId: 'advreg-register-btn'
        },
          loading ? React.createElement(ActivityIndicator, { color: '#FFFFFF' }) : React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' } }, 'Register as Advocate')
        )
      ),
      React.createElement(Modal, { visible: showExpModal, transparent: true, animationType: 'slide', onRequestClose: function() { setShowExpModal(false); } },
        React.createElement(View, { style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insets.top } },
          React.createElement(View, { style: { backgroundColor: cardColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: insets.bottom + 20 } },
            React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: borderColor } },
              React.createElement(Text, { style: { fontSize: 18, fontWeight: '700', color: textPrimary } }, 'Years of Experience'),
              React.createElement(TouchableOpacity, { onPress: function() { setShowExpModal(false); }, componentId: 'exp-modal-close' },
                React.createElement(MaterialIcons, { name: 'close', size: 24, color: textSecondary })
              )
            ),
            EXPERIENCE_LEVELS.map(function(level, idx) {
              return React.createElement(TouchableOpacity, {
                key: level,
                style: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: idx < EXPERIENCE_LEVELS.length - 1 ? 1 : 0, borderColor: borderColor, backgroundColor: experience === level ? theme.colors.primary + '10' : 'transparent' },
                onPress: function() { setExperience(level); setShowExpModal(false); },
                componentId: 'exp-option-' + idx
              },
                React.createElement(MaterialIcons, { name: experience === level ? 'radio-button-checked' : 'radio-button-unchecked', size: 22, color: experience === level ? theme.colors.primary : textSecondary }),
                React.createElement(Text, { style: { marginLeft: 14, fontSize: 16, color: experience === level ? theme.colors.primary : textPrimary, fontWeight: experience === level ? '600' : '400' } }, level)
              );
            })
          )
        )
      ),
      React.createElement(Modal, { visible: showDistModal, transparent: true, animationType: 'slide', onRequestClose: function() { setShowDistModal(false); } },
        React.createElement(View, { style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insets.top } },
          React.createElement(View, { style: { backgroundColor: cardColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%', paddingBottom: insets.bottom + 20 } },
            React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: borderColor } },
              React.createElement(Text, { style: { fontSize: 18, fontWeight: '700', color: textPrimary } }, 'Select District'),
              React.createElement(TouchableOpacity, { onPress: function() { setShowDistModal(false); }, componentId: 'dist-modal-close' },
                React.createElement(MaterialIcons, { name: 'close', size: 24, color: textSecondary })
              )
            ),
            React.createElement(ScrollView, { style: { flex: 1 } },
              DISTRICTS.map(function(d, idx) {
                return React.createElement(TouchableOpacity, {
                  key: d,
                  style: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: idx < DISTRICTS.length - 1 ? 1 : 0, borderColor: borderColor, backgroundColor: district === d ? theme.colors.primary + '10' : 'transparent' },
                  onPress: function() { setDistrict(d); setShowDistModal(false); },
                  componentId: 'dist-option-' + idx
                },
                  React.createElement(MaterialIcons, { name: 'location-city', size: 20, color: district === d ? theme.colors.primary : textSecondary }),
                  React.createElement(Text, { style: { marginLeft: 14, fontSize: 15, color: district === d ? theme.colors.primary : textPrimary, fontWeight: district === d ? '600' : '400' } }, d)
                );
              })
            )
          )
        )
      )
    );
  };
  // @end:AdvocateRegScreen

  // @section:ClientRegScreen @depends:[ThemeContext,styles]
  var ClientRegScreen = function(props) {
    var navigation = props.navigation;
    var route = props.route;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var appCtx = useAppContext();
    var insets = useSafeAreaInsets();
    var params = route && route.params ? route.params : {};
    var passedUsername = params.username || '';
    var password = params.password || '';

    var usernameState = useState(passedUsername);
    var username = usernameState[0];
    var setUsername = usernameState[1];
    var emailState = useState('');
    var email = emailState[0];
    var setEmail = emailState[1];
    var phoneState = useState('');
    var phone = phoneState[0];
    var setPhone = phoneState[1];
    var loadingState = useState(false);
    var loading = loadingState[0];
    var setLoading = loadingState[1];

    var mutHook = useMutation('clients', 'insert');
    var insertClient = mutHook.mutate;

    var winH = Dimensions.get('window').height;
    var scrollH = winH - insets.top - insets.bottom - HEADER_HEIGHT;

    var handleRegister = function() {
      if (!username || !email || !phone) {
        Platform.OS === 'web' ? window.alert('Please fill all fields') : Alert.alert('Error', 'Please fill all fields');
        return;
      }
      if (phone.replace(/[^0-9]/g, '').length < 10) {
        Platform.OS === 'web' ? window.alert('Enter a valid phone number') : Alert.alert('Error', 'Enter a valid phone number');
        return;
      }
      setLoading(true);
      var newId = 'cli-' + Date.now();
      insertClient({
        id: newId,
        username: username,
        email: email,
        phone: phone,
        password: password,
        created_at: Date.now()
      }).then(function() {
        setLoading(false);
        appCtx.setCurrentUser({ id: newId, username: username, email: email, phone: phone, role: 'client' });
        appCtx.setUserRole('client');
        navigation.navigate('ClientCasePost', { clientId: newId, username: username });
      }).catch(function() {
        setLoading(false);
        Platform.OS === 'web' ? window.alert('Registration failed. Please try again.') : Alert.alert('Error', 'Registration failed. Please try again.');
      });
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'clientreg-screen' },
      React.createElement(StatusBar, { barStyle: 'dark-content' }),
      React.createElement(View, { style: { backgroundColor: '#10B981', paddingTop: insets.top + 10, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', minHeight: HEADER_HEIGHT + insets.top }, componentId: 'clientreg-header' },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { marginRight: 16 }, componentId: 'clientreg-back-btn' },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFFFFF' })
        ),
        React.createElement(View, null,
          React.createElement(Text, { style: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' } }, 'Client Registration'),
          React.createElement(Text, { style: { fontSize: 12, color: 'rgba(255,255,255,0.8)' } }, 'Quick and easy setup')
        )
      ),
      React.createElement(ScrollView, { style: Platform.OS === 'web' ? { height: scrollH, overflow: 'auto' } : { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: 40 } },
        React.createElement(View, { style: { alignItems: 'center', marginBottom: 28 }, componentId: 'clientreg-icon' },
          React.createElement(View, { style: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#10B981' + '20', alignItems: 'center', justifyContent: 'center' } },
            React.createElement(MaterialIcons, { name: 'person', size: 36, color: '#10B981' })
          )
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Username'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'person', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: username, onChangeText: setUsername,
            placeholder: 'Your username', placeholderTextColor: '#9CA3AF',
            autoCapitalize: 'none', autoCorrect: false, componentId: 'clientreg-username-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Email Address'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'email', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: email, onChangeText: setEmail,
            placeholder: 'Enter email address', placeholderTextColor: '#9CA3AF',
            keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false,
            componentId: 'clientreg-email-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Phone Number'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 32 } },
          React.createElement(MaterialIcons, { name: 'phone', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: phone, onChangeText: function(t) { setPhone(t.replace(/[^0-9+\-() ]/g, '')); },
            placeholder: 'Enter phone number', placeholderTextColor: '#9CA3AF',
            keyboardType: 'phone-pad', componentId: 'clientreg-phone-input'
          })
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: loading ? '#6EE7B7' : '#10B981', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#10B981', shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
          onPress: handleRegister, disabled: loading, componentId: 'clientreg-register-btn'
        },
          loading ? React.createElement(ActivityIndicator, { color: '#FFFFFF' }) : React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' } }, 'Register as Client')
        )
      )
    );
  };
  // @end:ClientRegScreen

  // @section:ClientCasePostScreen @depends:[ThemeContext,styles]
  var ClientCasePostScreen = function(props) {
    var navigation = props.navigation;
    var route = props.route;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var params = route && route.params ? route.params : {};
    var clientId = params.clientId || 'unknown';
    var username = params.username || 'Client';

    var categoryState = useState('');
    var category = categoryState[0];
    var setCategory = categoryState[1];
    var descState = useState('');
    var description = descState[0];
    var setDescription = descState[1];
    var opposingState = useState('');
    var opposingParty = opposingState[0];
    var setOpposingParty = opposingState[1];
    var modeState = useState('');
    var consultMode = modeState[0];
    var setConsultMode = modeState[1];
    var showCatState = useState(false);
    var showCatModal = showCatState[0];
    var setShowCatModal = showCatState[1];
    var loadingState = useState(false);
    var loading = loadingState[0];
    var setLoading = loadingState[1];
    var docFileState = useState(null);
    var docFile = docFileState[0];
    var setDocFile = docFileState[1];

    var filePickerHook = useFilePicker();
    var pickDocument = filePickerHook.pickDocument;
    var fpLoading = filePickerHook.isLoading;
    var fpError = filePickerHook.error;

    var mutHook = useMutation('cases', 'insert');
    var insertCase = mutHook.mutate;

    var winH = Dimensions.get('window').height;
    var scrollH = winH - insets.top - insets.bottom - HEADER_HEIGHT;

    var handlePickDoc = function() {
      pickDocument({ type: ['application/pdf', 'image/*'] }).then(function(result) {
        if (!result.cancelled && result.file) { setDocFile(result.file); }
      });
    };

    var handleSubmit = function() {
      if (!category || !description || !opposingParty || !consultMode) {
        Platform.OS === 'web' ? window.alert('Please fill all required fields') : Alert.alert('Error', 'Please fill all required fields');
        return;
      }
      if (description.length < 20) {
        Platform.OS === 'web' ? window.alert('Please provide a more detailed case description (at least 20 characters)') : Alert.alert('Error', 'Please provide a more detailed case description');
        return;
      }
      setLoading(true);
      insertCase({
        id: 'case-' + Date.now(),
        client_id: clientId,
        category: category,
        description: description,
        opposing_party: opposingParty,
        consultation_mode: consultMode,
        document_uri: docFile ? docFile.uri : null,
        document_name: docFile ? docFile.name : null,
        created_at: Date.now()
      }).then(function() {
        setLoading(false);
        Platform.OS === 'web' ? window.alert('Case posted successfully! Advocates will review your case.') : Alert.alert('Success', 'Case posted successfully! Advocates will review your case.');
        navigation.navigate('MainApp');
      }).catch(function() {
        setLoading(false);
        Platform.OS === 'web' ? window.alert('Failed to post case. Please try again.') : Alert.alert('Error', 'Failed to post case. Please try again.');
      });
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'casepost-screen' },
      React.createElement(StatusBar, { barStyle: 'dark-content' }),
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 10, paddingBottom: 20, paddingHorizontal: 20, minHeight: HEADER_HEIGHT + insets.top }, componentId: 'casepost-header' },
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
          React.createElement(MaterialIcons, { name: 'description', size: 22, color: '#FFFFFF' }),
          React.createElement(Text, { style: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 } }, 'Post Your Case')
        ),
        React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.8)' } }, 'Welcome, ' + username + '! Tell us about your legal issue')
      ),
      React.createElement(ScrollView, { style: Platform.OS === 'web' ? { height: scrollH, overflow: 'auto' } : { flex: 1 }, contentContainerStyle: { padding: 20, paddingBottom: 40 } },
        fpError ? React.createElement(View, { style: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' } },
          React.createElement(MaterialIcons, { name: 'error', size: 18, color: errorColor }),
          React.createElement(Text, { style: { flex: 1, marginLeft: 8, color: errorColor, fontSize: 13 } }, fpError)
        ) : null,
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Case Category *'),
        React.createElement(TouchableOpacity, {
          style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: category ? theme.colors.primary : borderColor, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 16 },
          onPress: function() { setShowCatModal(true); }, componentId: 'casepost-cat-btn'
        },
          React.createElement(MaterialIcons, { name: 'folder-open', size: 20, color: category ? theme.colors.primary : textSecondary }),
          React.createElement(Text, { style: { flex: 1, marginLeft: 10, fontSize: 15, color: category ? textPrimary : '#9CA3AF', fontWeight: category ? '500' : '400' } }, category || 'Select case category'),
          React.createElement(MaterialIcons, { name: 'expand-more', size: 24, color: textSecondary })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Case Description *'),
        React.createElement(View, { style: { backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, marginBottom: 16 } },
          React.createElement(TextInput, {
            style: { fontSize: 15, color: textPrimary, minHeight: 100, textAlignVertical: 'top' },
            value: description, onChangeText: setDescription,
            placeholder: 'Describe your legal issue in detail...', placeholderTextColor: '#9CA3AF',
            multiline: true, numberOfLines: 5, textAlignVertical: 'top',
            componentId: 'casepost-desc-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Opposing Party Name *'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: borderColor, paddingHorizontal: 14, marginBottom: 16 } },
          React.createElement(MaterialIcons, { name: 'person-outline', size: 20, color: textSecondary }),
          React.createElement(TextInput, {
            style: { flex: 1, paddingVertical: 14, paddingLeft: 10, fontSize: 15, color: textPrimary },
            value: opposingParty, onChangeText: setOpposingParty,
            placeholder: 'Name of opposing party', placeholderTextColor: '#9CA3AF',
            autoCapitalize: 'words', componentId: 'casepost-opposing-input'
          })
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Document Upload (Optional)'),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: docFile ? '#ECFDF5' : cardColor, borderRadius: 10, borderWidth: 1.5, borderColor: docFile ? '#10B981' : borderColor, borderStyle: docFile ? 'solid' : 'dashed', paddingVertical: 16, paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
          onPress: handlePickDoc, disabled: fpLoading,
          componentId: 'casepost-doc-btn'
        },
          React.createElement(MaterialIcons, { name: docFile ? 'check-circle' : 'attach-file', size: 28, color: docFile ? '#10B981' : theme.colors.primary }),
          React.createElement(View, { style: { flex: 1, marginLeft: 12 } },
            React.createElement(Text, { style: { fontSize: 14, fontWeight: '600', color: docFile ? '#10B981' : theme.colors.textPrimary } }, docFile ? 'Document Attached' : 'Attach Legal Document'),
            React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 } }, docFile ? docFile.name : 'FIR, legal notice, contract (PDF/Image)')
          ),
          fpLoading ? React.createElement(ActivityIndicator, { size: 'small', color: theme.colors.primary }) : null
        ),
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Preferred Consultation Mode *'),
        React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 } },
          CONSULTATION_MODES.map(function(mode) {
            var icons = { 'In-Person': 'people', 'Video Call': 'videocam', 'Audio Call': 'phone', 'Chat': 'chat' };
            var selected = consultMode === mode;
            return React.createElement(TouchableOpacity, {
              key: mode,
              style: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: selected ? theme.colors.primary : borderColor, backgroundColor: selected ? theme.colors.primary + '10' : cardColor, marginRight: 8, marginBottom: 8 },
              onPress: function() { setConsultMode(mode); },
              componentId: 'casepost-mode-' + mode
            },
              React.createElement(MaterialIcons, { name: icons[mode] || 'chat', size: 18, color: selected ? theme.colors.primary : textSecondary }),
              React.createElement(Text, { style: { marginLeft: 6, fontSize: 13, fontWeight: selected ? '700' : '400', color: selected ? theme.colors.primary : textPrimary } }, mode)
            );
          })
        ),
        React.createElement(TouchableOpacity, {
          style: { backgroundColor: loading ? '#93C5FD' : theme.colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: theme.colors.primary, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
          onPress: handleSubmit, disabled: loading, componentId: 'casepost-submit-btn'
        },
          loading ? React.createElement(ActivityIndicator, { color: '#FFFFFF' }) : React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
            React.createElement(MaterialIcons, { name: 'send', size: 20, color: '#FFFFFF' }),
            React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginLeft: 8 } }, 'Submit Case')
          )
        )
      ),
      React.createElement(Modal, { visible: showCatModal, transparent: true, animationType: 'slide', onRequestClose: function() { setShowCatModal(false); } },
        React.createElement(View, { style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insets.top } },
          React.createElement(View, { style: { backgroundColor: cardColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: insets.bottom + 20 } },
            React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: borderColor } },
              React.createElement(Text, { style: { fontSize: 18, fontWeight: '700', color: textPrimary } }, 'Select Case Category'),
              React.createElement(TouchableOpacity, { onPress: function() { setShowCatModal(false); }, componentId: 'cat-modal-close' },
                React.createElement(MaterialIcons, { name: 'close', size: 24, color: textSecondary })
              )
            ),
            CASE_CATEGORIES.map(function(cat, idx) {
              var catIcons = { 'Property': 'home', 'Divorce/Family': 'family-restroom', 'Business': 'business', 'Criminal': 'security', 'Traffic': 'directions-car', 'Employment': 'work', 'Consumer': 'shopping-cart', 'Civil': 'gavel' };
              return React.createElement(TouchableOpacity, {
                key: cat,
                style: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: idx < CASE_CATEGORIES.length - 1 ? 1 : 0, borderColor: borderColor, backgroundColor: category === cat ? theme.colors.primary + '10' : 'transparent' },
                onPress: function() { setCategory(cat); setShowCatModal(false); },
                componentId: 'cat-option-' + idx
              },
                React.createElement(View, { style: { width: 38, height: 38, borderRadius: 19, backgroundColor: (category === cat ? theme.colors.primary : borderColor) + '30', alignItems: 'center', justifyContent: 'center' } },
                  React.createElement(MaterialIcons, { name: catIcons[cat] || 'folder', size: 20, color: category === cat ? theme.colors.primary : textSecondary })
                ),
                React.createElement(Text, { style: { marginLeft: 14, fontSize: 16, color: category === cat ? theme.colors.primary : textPrimary, fontWeight: category === cat ? '600' : '400' } }, cat)
              );
            })
          )
        )
      )
    );
  };
  // @end:ClientCasePostScreen

  // @section:HomeScreen @depends:[ThemeContext,styles,static-data]
  var HomeScreen = function(props) {
    var navigation = props.navigation;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var appCtx = useAppContext();
    var filterState = useState(false);
    var showFilter = filterState[0];
    var setShowFilter = filterState[1];
    var expFilterState = useState('');
    var expFilter = expFilterState[0];
    var setExpFilter = expFilterState[1];
    var distFilterState = useState('');
    var distFilter = distFilterState[0];
    var setDistFilter = distFilterState[1];
    var appliedExpState = useState('');
    var appliedExp = appliedExpState[0];
    var setAppliedExp = appliedExpState[1];
    var appliedDistState = useState('');
    var appliedDist = appliedDistState[0];
    var setAppliedDist = appliedDistState[1];
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var advocates = useMemo(function() {
      var list = SEED_ADVOCATES.slice();
      if (appliedExp) {
        list = list.filter(function(a) {
          var expNum = parseInt(a.experience, 10);
          if (appliedExp === '1-3 years') return expNum >= 1 && expNum <= 3;
          if (appliedExp === '4-7 years') return expNum >= 4 && expNum <= 7;
          if (appliedExp === '8-12 years') return expNum >= 8 && expNum <= 12;
          if (appliedExp === '13-20 years') return expNum >= 13 && expNum <= 20;
          if (appliedExp === '20+ years') return expNum > 20;
          return true;
        });
      }
      if (appliedDist) {
        list = list.filter(function(a) { return a.district === appliedDist; });
      }
      return list;
    }, [appliedExp, appliedDist]);

    var handleApplyFilter = function() {
      setAppliedExp(expFilter);
      setAppliedDist(distFilter);
      setShowFilter(false);
    };

    var handleClearFilter = function() {
      setExpFilter('');
      setDistFilter('');
      setAppliedExp('');
      setAppliedDist('');
    };

    var hasActiveFilter = appliedExp || appliedDist;

    var renderAdvocateCard = function(item) {
      return React.createElement(TouchableOpacity, {
        style: { backgroundColor: cardColor, borderRadius: 14, marginHorizontal: 16, marginBottom: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, flexDirection: 'row', alignItems: 'center' },
        componentId: 'home-adv-card-' + item.id,
        activeOpacity: 0.85
      },
        React.createElement(View, { style: { position: 'relative', marginRight: 14 } },
          React.createElement(Image, {
            source: { uri: item.image },
            style: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E2E8F0' },
            componentId: 'home-adv-img-' + item.id
          }),
          React.createElement(View, { style: { position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: successColor, borderWidth: 2, borderColor: cardColor } })
        ),
        React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, { style: { fontSize: 16, fontWeight: '700', color: textPrimary, marginBottom: 2 } }, item.name),
          React.createElement(Text, { style: { fontSize: 13, color: theme.colors.primary, fontWeight: '600', marginBottom: 6 } }, item.specialization),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
            React.createElement(MaterialIcons, { name: 'location-on', size: 13, color: textSecondary }),
            React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginLeft: 3 } }, item.district),
            React.createElement(View, { style: { width: 1, height: 12, backgroundColor: borderColor, marginHorizontal: 8 } }),
            React.createElement(MaterialIcons, { name: 'work', size: 13, color: textSecondary }),
            React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginLeft: 3 } }, item.experience)
          ),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
            React.createElement(MaterialIcons, { name: 'star', size: 14, color: goldColor }),
            React.createElement(Text, { style: { fontSize: 13, fontWeight: '700', color: textPrimary, marginLeft: 3 } }, String(item.rating)),
            React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginLeft: 6 } }, item.cases + ' cases')
          )
        ),
        React.createElement(MaterialIcons, { name: 'chevron-right', size: 22, color: borderColor })
      );
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'home-screen' },
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, componentId: 'home-header' },
        React.createElement(View, null,
          React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' } }, 'Find Your Advocate'),
          React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 } }, String(advocates.length) + ' advocates available')
        ),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
          hasActiveFilter ? React.createElement(TouchableOpacity, { onPress: handleClearFilter, style: { marginRight: 8, backgroundColor: '#FBBF24', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }, componentId: 'home-clear-filter' },
            React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' } }, 'Clear')
          ) : null,
          React.createElement(TouchableOpacity, {
            onPress: function() { setExpFilter(appliedExp); setDistFilter(appliedDist); setShowFilter(true); },
            style: { backgroundColor: hasActiveFilter ? '#FBBF24' : 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 8 },
            componentId: 'home-filter-btn'
          },
            React.createElement(MaterialIcons, { name: 'tune', size: 22, color: '#FFFFFF' })
          )
        )
      ),
      hasActiveFilter ? React.createElement(View, { style: { backgroundColor: theme.colors.primary + '15', paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' } },
        React.createElement(Text, { style: { fontSize: 12, color: theme.colors.primary, fontWeight: '600', marginRight: 6 } }, 'Active filters:'),
        appliedExp ? React.createElement(View, { style: { backgroundColor: theme.colors.primary + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginRight: 6 } },
          React.createElement(Text, { style: { fontSize: 12, color: theme.colors.primary } }, appliedExp)
        ) : null,
        appliedDist ? React.createElement(View, { style: { backgroundColor: theme.colors.primary + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 } },
          React.createElement(Text, { style: { fontSize: 12, color: theme.colors.primary } }, appliedDist)
        ) : null
      ) : null,
      advocates.length === 0 ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 } },
        React.createElement(MaterialIcons, { name: 'search-off', size: 60, color: borderColor }),
        React.createElement(Text, { style: { fontSize: 18, fontWeight: '700', color: textPrimary, marginTop: 16 } }, 'No Advocates Found'),
        React.createElement(Text, { style: { fontSize: 14, color: textSecondary, marginTop: 8, textAlign: 'center' } }, 'Try adjusting your filters to see more results'),
        React.createElement(TouchableOpacity, { onPress: handleClearFilter, style: { marginTop: 20, backgroundColor: theme.colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }, componentId: 'home-no-result-clear' },
          React.createElement(Text, { style: { color: '#FFFFFF', fontWeight: '700' } }, 'Clear Filters')
        )
      ) : React.createElement(FlatList, {
        data: advocates,
        keyExtractor: function(item) { return item.id; },
        renderItem: function(itemData) { return renderAdvocateCard(itemData.item); },
        contentContainerStyle: { paddingTop: 16, paddingBottom: scrollBottomPadding },
        showsVerticalScrollIndicator: false
      }),
      React.createElement(Modal, { visible: showFilter, transparent: true, animationType: 'slide', onRequestClose: function() { setShowFilter(false); } },
        React.createElement(View, { style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insets.top } },
          React.createElement(View, { style: { backgroundColor: cardColor, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: insets.bottom + 20, maxHeight: '80%' } },
            React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: borderColor } },
              React.createElement(Text, { style: { fontSize: 20, fontWeight: '800', color: textPrimary } }, 'Filter Advocates'),
              React.createElement(TouchableOpacity, { onPress: function() { setShowFilter(false); }, componentId: 'filter-modal-close' },
                React.createElement(MaterialIcons, { name: 'close', size: 26, color: textSecondary })
              )
            ),
            React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 20 } },
              React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: textPrimary, marginBottom: 12 } }, 'Years of Experience'),
              React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } },
                React.createElement(TouchableOpacity, {
                  style: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: !expFilter ? theme.colors.primary : borderColor, backgroundColor: !expFilter ? theme.colors.primary + '15' : 'transparent', marginRight: 8, marginBottom: 8 },
                  onPress: function() { setExpFilter(''); }, componentId: 'filter-exp-all'
                },
                  React.createElement(Text, { style: { fontSize: 13, color: !expFilter ? theme.colors.primary : textSecondary, fontWeight: !expFilter ? '700' : '400' } }, 'All')
                ),
                EXPERIENCE_LEVELS.map(function(level) {
                  var sel = expFilter === level;
                  return React.createElement(TouchableOpacity, {
                    key: level,
                    style: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: sel ? theme.colors.primary : borderColor, backgroundColor: sel ? theme.colors.primary + '15' : 'transparent', marginRight: 8, marginBottom: 8 },
                    onPress: function() { setExpFilter(level); },
                    componentId: 'filter-exp-' + level
                  },
                    React.createElement(Text, { style: { fontSize: 13, color: sel ? theme.colors.primary : textSecondary, fontWeight: sel ? '700' : '400' } }, level)
                  );
                })
              ),
              React.createElement(View, { style: { height: 1, backgroundColor: borderColor, marginVertical: 20 } }),
              React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: textPrimary, marginBottom: 12 } }, 'District'),
              React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } },
                React.createElement(TouchableOpacity, {
                  style: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: !distFilter ? theme.colors.primary : borderColor, backgroundColor: !distFilter ? theme.colors.primary + '15' : 'transparent', marginRight: 8, marginBottom: 8 },
                  onPress: function() { setDistFilter(''); }, componentId: 'filter-dist-all'
                },
                  React.createElement(Text, { style: { fontSize: 13, color: !distFilter ? theme.colors.primary : textSecondary, fontWeight: !distFilter ? '700' : '400' } }, 'All')
                ),
                DISTRICTS.map(function(d) {
                  var sel = distFilter === d;
                  return React.createElement(TouchableOpacity, {
                    key: d,
                    style: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: sel ? theme.colors.primary : borderColor, backgroundColor: sel ? theme.colors.primary + '15' : 'transparent', marginRight: 8, marginBottom: 8 },
                    onPress: function() { setDistFilter(d); },
                    componentId: 'filter-dist-' + d
                  },
                    React.createElement(Text, { style: { fontSize: 13, color: sel ? theme.colors.primary : textSecondary, fontWeight: sel ? '700' : '400' } }, d)
                  );
                })
              )
            ),
            React.createElement(View, { style: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderColor: borderColor } },
              React.createElement(TouchableOpacity, {
                style: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: borderColor, alignItems: 'center', marginRight: 12 },
                onPress: function() { setExpFilter(''); setDistFilter(''); },
                componentId: 'filter-reset-btn'
              },
                React.createElement(Text, { style: { fontSize: 15, fontWeight: '600', color: textSecondary } }, 'Reset')
              ),
              React.createElement(TouchableOpacity, {
                style: { flex: 2, paddingVertical: 14, borderRadius: 10, backgroundColor: theme.colors.primary, alignItems: 'center', shadowColor: theme.colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
                onPress: handleApplyFilter,
                componentId: 'filter-apply-btn'
              },
                React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' } }, 'Apply Filters')
              )
            )
          )
        )
      )
    );
  };
  // @end:HomeScreen

  // @section:MyProfileScreen @depends:[ThemeContext,styles,AppContext]
  var MyProfileScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var appCtx = useAppContext();
    var currentUser = appCtx.currentUser;
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var user = currentUser || { username: 'User', role: 'client', email: 'user@example.com' };

    var profileItems = user.role === 'advocate' ? [
      { icon: 'badge', label: 'Role', value: 'Advocate' },
      { icon: 'work', label: 'Experience', value: user.experience || '-' },
      { icon: 'location-city', label: 'District', value: user.district || '-' }
    ] : [
      { icon: 'person', label: 'Role', value: 'Client' },
      { icon: 'email', label: 'Email', value: user.email || '-' },
      { icon: 'phone', label: 'Phone', value: user.phone || '-' }
    ];

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'profile-screen' },
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 12, paddingBottom: 30, alignItems: 'center' }, componentId: 'profile-header' },
        React.createElement(View, { style: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' } },
          React.createElement(MaterialIcons, { name: user.role === 'advocate' ? 'gavel' : 'person', size: 44, color: '#FFFFFF' })
        ),
        React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' }, componentId: 'profile-username' }, user.username),
        React.createElement(View, { style: { backgroundColor: user.role === 'advocate' ? 'rgba(255,255,255,0.25)' : 'rgba(16,185,129,0.6)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4, marginTop: 6 } },
          React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 } }, user.role === 'advocate' ? 'Advocate' : 'Client')
        )
      ),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 20, paddingBottom: scrollBottomPadding } },
        React.createElement(View, { style: { backgroundColor: cardColor, borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }, componentId: 'profile-info-card' },
          React.createElement(Text, { style: { fontSize: 16, fontWeight: '700', color: textPrimary, marginBottom: 16 } }, 'Profile Information'),
          profileItems.map(function(item, idx) {
            return React.createElement(View, {
              key: item.label,
              style: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: idx < profileItems.length - 1 ? 1 : 0, borderColor: borderColor },
              componentId: 'profile-item-' + idx
            },
              React.createElement(View, { style: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 14 } },
                React.createElement(MaterialIcons, { name: item.icon, size: 20, color: theme.colors.primary })
              ),
              React.createElement(View, { style: { flex: 1 } },
                React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginBottom: 2 } }, item.label),
                React.createElement(Text, { style: { fontSize: 15, fontWeight: '600', color: textPrimary } }, item.value)
              )
            );
          })
        ),
        React.createElement(View, { style: { backgroundColor: cardColor, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }, componentId: 'profile-actions-card' },
          React.createElement(Text, { style: { fontSize: 16, fontWeight: '700', color: textPrimary, marginBottom: 16 } }, 'Account'),
          React.createElement(TouchableOpacity, { style: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: borderColor }, componentId: 'profile-notifications-btn' },
            React.createElement(View, { style: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 14 } },
              React.createElement(MaterialIcons, { name: 'notifications', size: 20, color: theme.colors.primary })
            ),
            React.createElement(Text, { style: { flex: 1, fontSize: 15, color: textPrimary } }, 'Notifications'),
            React.createElement(MaterialIcons, { name: 'chevron-right', size: 20, color: textSecondary })
          ),
          React.createElement(TouchableOpacity, { style: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: borderColor }, componentId: 'profile-privacy-btn' },
            React.createElement(View, { style: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 14 } },
              React.createElement(MaterialIcons, { name: 'privacy-tip', size: 20, color: theme.colors.primary })
            ),
            React.createElement(Text, { style: { flex: 1, fontSize: 15, color: textPrimary } }, 'Privacy & Security'),
            React.createElement(MaterialIcons, { name: 'chevron-right', size: 20, color: textSecondary })
          ),
          React.createElement(TouchableOpacity, { style: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }, componentId: 'profile-help-btn' },
            React.createElement(View, { style: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 14 } },
              React.createElement(MaterialIcons, { name: 'help-outline', size: 20, color: theme.colors.primary })
            ),
            React.createElement(Text, { style: { flex: 1, fontSize: 15, color: textPrimary } }, 'Help & Support'),
            React.createElement(MaterialIcons, { name: 'chevron-right', size: 20, color: textSecondary })
          )
        )
      )
    );
  };
  // @end:MyProfileScreen

  // @section:PostsScreen @depends:[ThemeContext,styles]
  var PostsScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var caseQuery = useQuery('cases', {}, { column: 'created_at', ascending: false });
    var cases = caseQuery.data || [];
    var casesLoading = caseQuery.loading;
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var DEMO_CASES = useMemo(function() {
      return [
        { id: 'demo-1', category: 'Property', description: 'Dispute with neighbor over boundary walls and encroachment on my land registered in 2018.', opposing_party: 'Ram Lal Gupta', consultation_mode: 'In-Person', created_at: Date.now() - 86400000 },
        { id: 'demo-2', category: 'Criminal', description: 'False FIR filed against me by ex-business partner. Need immediate legal assistance.', opposing_party: 'Suresh Sharma', consultation_mode: 'Video Call', created_at: Date.now() - 172800000 },
        { id: 'demo-3', category: 'Divorce/Family', description: 'Mutual divorce proceedings. Need guidance on child custody and asset division.', opposing_party: 'Private', consultation_mode: 'Chat', created_at: Date.now() - 259200000 }
      ];
    }, []);

    var allCases = (cases && cases.length > 0) ? cases : DEMO_CASES;

    var catColors = { 'Property': '#3B82F6', 'Criminal': '#EF4444', 'Divorce/Family': '#8B5CF6', 'Business': '#F59E0B', 'Traffic': '#10B981', 'Employment': '#6366F1', 'Consumer': '#EC4899', 'Civil': '#0EA5E9' };
    var modeIcons = { 'In-Person': 'people', 'Video Call': 'videocam', 'Audio Call': 'phone', 'Chat': 'chat' };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'posts-screen' },
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 }, componentId: 'posts-header' },
        React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' } }, 'Case Listings'),
        React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 } }, String(allCases.length) + ' active cases seeking advocates')
      ),
      casesLoading ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
        React.createElement(ActivityIndicator, { size: 'large', color: theme.colors.primary, componentId: 'posts-loading' })
      ) : React.createElement(FlatList, {
        data: allCases,
        keyExtractor: function(item) { return item.id; },
        contentContainerStyle: { padding: 16, paddingBottom: scrollBottomPadding },
        showsVerticalScrollIndicator: false,
        renderItem: function(itemData) {
          var c = itemData.item;
          var catColor = catColors[c.category] || theme.colors.primary;
          var days = Math.floor((Date.now() - (c.created_at || Date.now())) / 86400000);
          return React.createElement(View, {
            style: { backgroundColor: cardColor, borderRadius: 14, marginBottom: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
            componentId: 'posts-case-' + c.id
          },
            React.createElement(View, { style: { height: 5, backgroundColor: catColor } }),
            React.createElement(View, { style: { padding: 16 } },
              React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 } },
                React.createElement(View, { style: { backgroundColor: catColor + '20', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 } },
                  React.createElement(Text, { style: { fontSize: 12, fontWeight: '700', color: catColor } }, c.category)
                ),
                React.createElement(Text, { style: { fontSize: 11, color: textSecondary } }, days === 0 ? 'Today' : days + 'd ago')
              ),
              React.createElement(Text, { style: { fontSize: 14, color: textPrimary, lineHeight: 20, marginBottom: 12 }, numberOfLines: 3 }, c.description),
              React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
                React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                  React.createElement(MaterialIcons, { name: 'person-outline', size: 14, color: textSecondary }),
                  React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginLeft: 4 } }, 'vs ' + (c.opposing_party || 'Unknown'))
                ),
                c.consultation_mode ? React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary + '10', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 } },
                  React.createElement(MaterialIcons, { name: modeIcons[c.consultation_mode] || 'chat', size: 13, color: theme.colors.primary }),
                  React.createElement(Text, { style: { fontSize: 11, color: theme.colors.primary, marginLeft: 4, fontWeight: '600' } }, c.consultation_mode)
                ) : null
              ),
              c.document_name ? React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 8, padding: 8, marginTop: 10 } },
                React.createElement(MaterialIcons, { name: 'attach-file', size: 14, color: '#10B981' }),
                React.createElement(Text, { style: { fontSize: 12, color: '#10B981', marginLeft: 4 } }, c.document_name)
              ) : null,
              React.createElement(TouchableOpacity, {
                style: { backgroundColor: theme.colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 14 },
                componentId: 'posts-accept-' + c.id
              },
                React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' } }, 'View & Accept Case')
              )
            )
          );
        }
      })
    );
  };
  // @end:PostsScreen

  // @section:AdvocateListScreen @depends:[ThemeContext,styles,static-data]
  var AdvocateListScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'advlist-screen' },
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 }, componentId: 'advlist-header' },
        React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' } }, 'Advocates'),
        React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 } }, 'Verified legal professionals')
      ),
      React.createElement(FlatList, {
        data: SEED_ADVOCATES,
        keyExtractor: function(item) { return item.id; },
        numColumns: 1,
        contentContainerStyle: { padding: 16, paddingBottom: scrollBottomPadding },
        renderItem: function(itemData) {
          var adv = itemData.item;
          return React.createElement(View, {
            style: { backgroundColor: cardColor, borderRadius: 14, marginBottom: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, flexDirection: 'row', alignItems: 'center' },
            componentId: 'advlist-item-' + adv.id
          },
            React.createElement(Image, { source: { uri: adv.image }, style: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E2E8F0', marginRight: 14 }, componentId: 'advlist-img-' + adv.id }),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: textPrimary } }, adv.name),
              React.createElement(Text, { style: { fontSize: 12, color: theme.colors.primary, fontWeight: '600', marginVertical: 2 } }, adv.specialization),
              React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                React.createElement(MaterialIcons, { name: 'location-on', size: 12, color: textSecondary }),
                React.createElement(Text, { style: { fontSize: 11, color: textSecondary, marginLeft: 2 } }, adv.district),
                React.createElement(Text, { style: { fontSize: 11, color: textSecondary, marginHorizontal: 6 } }, '|'),
                React.createElement(MaterialIcons, { name: 'star', size: 12, color: goldColor }),
                React.createElement(Text, { style: { fontSize: 11, color: textSecondary, marginLeft: 2 } }, String(adv.rating))
              )
            ),
            React.createElement(View, { style: { backgroundColor: theme.colors.primary + '15', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' } },
              React.createElement(Text, { style: { fontSize: 12, fontWeight: '700', color: theme.colors.primary } }, 'View')
            )
          );
        }
      })
    );
  };
  // @end:AdvocateListScreen

  // @section:ClientListScreen @depends:[ThemeContext,styles]
  var ClientListScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var clientQuery = useQuery('clients', {}, { column: 'created_at', ascending: false });
    var clients = clientQuery.data || [];
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var DEMO_CLIENTS = [
      { id: 'dc1', username: 'Anita_Sharma', email: 'anita@email.com', phone: '9876543210' },
      { id: 'dc2', username: 'RajeshMehra', email: 'rajesh@email.com', phone: '9123456789' },
      { id: 'dc3', username: 'Preethi_V', email: 'preethi@email.com', phone: '8765432109' }
    ];

    var allClients = (clients && clients.length > 0) ? clients : DEMO_CLIENTS;

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'clientlist-screen' },
      React.createElement(View, { style: { backgroundColor: '#10B981', paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 }, componentId: 'clientlist-header' },
        React.createElement(Text, { style: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' } }, 'Clients'),
        React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 } }, String(allClients.length) + ' registered clients')
      ),
      React.createElement(FlatList, {
        data: allClients,
        keyExtractor: function(item) { return item.id; },
        contentContainerStyle: { padding: 16, paddingBottom: scrollBottomPadding },
        renderItem: function(itemData) {
          var cli = itemData.item;
          return React.createElement(View, {
            style: { backgroundColor: cardColor, borderRadius: 14, marginBottom: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, flexDirection: 'row', alignItems: 'center' },
            componentId: 'clientlist-item-' + cli.id
          },
            React.createElement(View, { style: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginRight: 14 } },
              React.createElement(MaterialIcons, { name: 'person', size: 28, color: '#10B981' })
            ),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: textPrimary } }, cli.username),
              React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginTop: 2 } }, cli.email),
              cli.phone ? React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginTop: 1 } }, cli.phone) : null
            ),
            React.createElement(View, { style: { backgroundColor: '#ECFDF5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 } },
              React.createElement(Text, { style: { fontSize: 11, fontWeight: '700', color: '#10B981' } }, 'Client')
            )
          );
        }
      })
    );
  };
  // @end:ClientListScreen

  // @section:TabNavigator @depends:[HomeScreen,MyProfileScreen,PostsScreen,AdvocateListScreen,ClientListScreen,navigation-setup]
  var TabNavigator = function() {
    var insets = useSafeAreaInsets();
    var themeCtx = useTheme();
    var theme = themeCtx.theme;

    return React.createElement(View, { style: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' } },
      React.createElement(Tab.Navigator, {
        screenOptions: {
          headerShown: false,
          tabBarStyle: {
            position: 'absolute', bottom: 0,
            height: Platform.OS === 'web' ? TAB_MENU_HEIGHT : TAB_MENU_HEIGHT + insets.bottom,
            borderTopWidth: 0, backgroundColor: cardColor,
            shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, elevation: 10
          },
          tabBarItemStyle: { padding: 0 },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: textSecondary,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: Platform.OS === 'ios' ? 0 : 4 }
        }
      },
        React.createElement(Tab.Screen, {
          name: 'Home',
          component: HomeScreen,
          options: {
            tabBarLabel: 'Home',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'home', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'MyProfile',
          component: MyProfileScreen,
          options: {
            tabBarLabel: 'My Profile',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'account-circle', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'Posts',
          component: PostsScreen,
          options: {
            tabBarLabel: 'Posts',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'article', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'Advocates',
          component: AdvocateListScreen,
          options: {
            tabBarLabel: 'Advocate',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'gavel', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'Clients',
          component: ClientListScreen,
          options: {
            tabBarLabel: 'Client',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'people', size: 24, color: p.color }); }
          }
        })
      )
    );
  };
  // @end:TabNavigator

  // @section:MainNavigator @depends:[LandingScreen,LoginScreen,SignUpScreen,RoleSelectionScreen,AdvocateRegScreen,ClientRegScreen,ClientCasePostScreen,TabNavigator,navigation-setup]
  var MainNavigator = function() {
    return React.createElement(Stack.Navigator, {
      screenOptions: { headerShown: false },
      initialRouteName: 'Landing'
    },
      React.createElement(Stack.Screen, { name: 'Landing', component: LandingScreen }),
      React.createElement(Stack.Screen, { name: 'Login', component: LoginScreen }),
      React.createElement(Stack.Screen, { name: 'SignUp', component: SignUpScreen }),
      React.createElement(Stack.Screen, { name: 'RoleSelection', component: RoleSelectionScreen, initialParams: { username: '', password: '' } }),
      React.createElement(Stack.Screen, { name: 'AdvocateReg', component: AdvocateRegScreen, initialParams: { username: '', password: '' } }),
      React.createElement(Stack.Screen, { name: 'ClientReg', component: ClientRegScreen, initialParams: { username: '', password: '' } }),
      React.createElement(Stack.Screen, { name: 'ClientCasePost', component: ClientCasePostScreen, initialParams: { clientId: null, username: '' } }),
      React.createElement(Stack.Screen, { name: 'MainApp', component: TabNavigator })
    );
  };
  // @end:MainNavigator

  // @section:styles @depends:[theme]
  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor
    },
    card: {
      backgroundColor: cardColor,
      borderRadius: 14,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3
    },
    headerText: {
      fontSize: 22,
      fontWeight: '800',
      color: '#FFFFFF'
    },
    fab: {
      position: 'absolute',
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: primaryColor,
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8
    }
  });
  // @end:styles

  // @section:return @depends:[ThemeProvider,AppProvider,MainNavigator]
  return React.createElement(AppProvider, null,
    React.createElement(ThemeProvider, null,
      React.createElement(View, { style: { flex: 1, width: '100%', height: '100%' } },
        React.createElement(StatusBar, { barStyle: 'dark-content', backgroundColor: backgroundColor }),
        React.createElement(MainNavigator)
      )
    )
  );
  // @end:return
};
return ComponentFunction;